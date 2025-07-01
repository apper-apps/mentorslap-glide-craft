import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { resourceService } from '@/services/api/resourceService';

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = [
    { id: 'all', label: 'All Resources', icon: 'BookOpen' },
    { id: 'productivity', label: 'Productivity', icon: 'Zap' },
    { id: 'growth', label: 'Growth Tactics', icon: 'TrendingUp' },
    { id: 'founding', label: 'Solo Founder Tips', icon: 'User' },
    { id: 'marketing', label: 'Marketing', icon: 'Megaphone' },
    { id: 'tools', label: 'Tools & Resources', icon: 'Wrench' }
  ];
  
  const loadResources = async () => {
    try {
      setError('');
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      const data = await resourceService.getAll();
      setResources(data);
    } catch (err) {
      setError('Failed to load resources. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadResources();
  }, []);
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadResources} />;
  
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Resources & Guides</h1>
        <p className="text-slate-400 mt-1">Learn, grow, and get inspired with curated content for entrepreneurs</p>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon="Search"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'primary' : 'ghost'}
              size="sm"
              icon={category.icon}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Results Count */}
      <div className="text-sm text-slate-400">
        Showing {filteredResources.length} of {resources.length} resources
      </div>
      
      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <Empty
          title="No resources found"
          description="Try adjusting your search or category filter to find more content"
          actionText="Clear Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedCategory('all');
          }}
          icon="Search"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full flex flex-col space-y-4 hover:shadow-xl transition-shadow duration-300">
                {/* Category Badge */}
                <div className="flex items-start justify-between">
                  <Badge variant="primary" size="sm">
                    {categories.find(cat => cat.id === resource.category)?.label || resource.category}
                  </Badge>
                  <div className="flex items-center space-x-1 text-slate-400 text-sm">
                    <ApperIcon name="Clock" size={14} />
                    <span>{resource.readTime} min read</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold text-slate-100 leading-tight">
                    {resource.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {resource.description}
                  </p>
                </div>
                
                {/* Tags */}
                {resource.tags && resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {resource.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {resource.tags.length > 3 && (
                      <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                        +{resource.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                
                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <ApperIcon name="User" size={14} />
                    <span>{resource.author}</span>
                  </div>
                  <Button variant="ghost" size="sm" icon="ExternalLink">
                    Read More
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Newsletter CTA */}
      <Card className="p-8 text-center bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border-primary-500/20" glow>
        <div className="space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name="Mail" size={24} className="text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-100">Stay in the Loop</h3>
            <p className="text-slate-400">
              Get weekly entrepreneur tips, new resources, and motivation slaps delivered to your inbox.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Input
              placeholder="Enter your email"
              className="flex-1"
            />
            <Button variant="primary">
              Subscribe
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResourcesPage;