import React, { useState } from 'react';
import { Eye, EyeOff, Share2, MapPin, Navigation2 } from 'lucide-react';
import './MapStyles.css';

const InteractiveLegend = ({ 
  onStatusFilter, 
  statusCounts = {}, 
  activeFilters = [],
  onShareAddress,
  onTrackVehicle 
}) => {
  const [hoveredStatus, setHoveredStatus] = useState(null);

  const statusConfig = {
    available: { 
      color: '#2ecc71', 
      label: 'Available', 
      icon: '🟢' 
    },
    on_patrol: { 
      color: '#3498db', 
      label: 'On Patrol', 
      icon: '🔵' 
    },
    responding: { 
      color: '#f39c12', 
      label: 'Responding', 
      icon: '🟡' 
    },
    out_of_service: { 
      color: '#e74c3c', 
      label: 'Out of Service', 
      icon: '🔴' 
    }
  };

  const handleStatusToggle = (status) => {
    if (onStatusFilter) {
      onStatusFilter(status);
    }
  };

  const isFilterActive = (status) => {
    return activeFilters.length === 0 || activeFilters.includes(status);
  };

  return (
    <div className="map-legend">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <Navigation2 size={16} />
        <h5 style={{ margin: 0, color: '#2c3e50', fontSize: '14px' }}>
          Vehicle Status Legend
        </h5>
      </div>
      
      {Object.entries(statusConfig).map(([status, config]) => {
        const count = statusCounts[status] || 0;
        const isActive = isFilterActive(status);
        
        return (
          <div 
            key={status}
            className={`legend-item ${isActive ? 'active' : 'inactive'}`}
            style={{ 
              opacity: isActive ? 1 : 0.5,
              cursor: 'pointer',
              padding: '8px 4px',
              borderRadius: '4px',
              transition: 'all 0.2s',
              backgroundColor: hoveredStatus === status ? '#f8f9fa' : 'transparent'
            }}
            onClick={() => handleStatusToggle(status)}
            onMouseEnter={() => setHoveredStatus(status)}
            onMouseLeave={() => setHoveredStatus(null)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                className="legend-color"
                style={{ 
                  backgroundColor: config.color,
                  position: 'relative'
                }}
              >
                {isActive ? <Eye size={10} color="white" /> : <EyeOff size={10} color="white" />}
              </div>
              <span style={{ flex: 1, fontSize: '13px', color: '#555' }}>
                {config.label}
              </span>
              <span style={{ 
                fontSize: '12px', 
                color: '#666',
                backgroundColor: '#f0f0f0',
                padding: '2px 6px',
                borderRadius: '10px',
                minWidth: '18px',
                textAlign: 'center'
              }}>
                {count}
              </span>
            </div>
          </div>
        );
      })}
      
      <div style={{ 
        marginTop: '15px', 
        paddingTop: '12px', 
        borderTop: '1px solid #eee' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <Share2 size={14} />
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#2c3e50' }}>
            Quick Actions
          </span>
        </div>
        
        <button 
          onClick={onShareAddress}
          style={{
            width: '100%',
            padding: '6px 12px',
            border: '1px solid #3498db',
            borderRadius: '4px',
            background: 'white',
            color: '#3498db',
            fontSize: '12px',
            cursor: 'pointer',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#3498db';
            e.target.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'white';
            e.target.style.color = '#3498db';
          }}
        >
          <Share2 size={12} />
          Share Location
        </button>
        
        <button 
          onClick={onTrackVehicle}
          style={{
            width: '100%',
            padding: '6px 12px',
            border: '1px solid #2ecc71',
            borderRadius: '4px',
            background: 'white',
            color: '#2ecc71',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#2ecc71';
            e.target.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'white';
            e.target.style.color = '#2ecc71';
          }}
        >
          <MapPin size={12} />
          Track Vehicle
        </button>
      </div>
      
      <div style={{ 
        marginTop: '12px', 
        fontSize: '11px', 
        color: '#999',
        textAlign: 'center' 
      }}>
        Click status to filter • {Object.values(statusCounts).reduce((a, b) => a + b, 0)} total vehicles
      </div>
    </div>
  );
};

export default InteractiveLegend;