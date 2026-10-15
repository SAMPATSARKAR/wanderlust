import React from 'react';
import { Flame, Home, Waves, Landmark, Compass, Castle, Sun, Palmtree, Trees } from 'lucide-react';

const CATEGORIES = [
  { id: 'All', label: 'All Homes', icon: Compass },
  { id: 'Trending', label: 'Trending', icon: Flame },
  { id: 'Cabins', label: 'Cabins', icon: Home },
  { id: 'Beachfront', label: 'Beachfront', icon: Waves },
  { id: 'Iconic Cities', label: 'Iconic Cities', icon: Landmark },
  { id: 'Lakefront', label: 'Lakefront', icon: Waves },
  { id: 'Castles', label: 'Castles', icon: Castle },
  { id: 'Desert', label: 'Desert', icon: Sun },
  { id: 'Tropical', label: 'Tropical', icon: Palmtree },
  { id: 'Countryside', label: 'Countryside', icon: Trees }
];

const CategoryBar = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="category-bar-wrapper">
      <div className="category-bar-inner">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              id={`cat-${cat.id.toLowerCase().replace(/\s+/g, '-')}`}
              className={`category-pill ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <Icon size={18} className="category-icon" />
              <span className="category-label">{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBar;
