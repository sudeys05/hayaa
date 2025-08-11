import React, { useState } from 'react';
import { Plus, MapPin, Navigation, Target, Settings } from 'lucide-react';
import './MapStyles.css';

const VehicleTrackingControls = ({ onAddVehicle, onTrackingModeChange, trackingMode = 'view' }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    vehicleId: '',
    licensePlate: '',
    vehicleType: 'patrol',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    status: 'available'
  });

  const [clickLocation, setClickLocation] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newVehicle.vehicleId || !newVehicle.licensePlate || !clickLocation) {
      alert('Please fill all required fields and click on the map to set location');
      return;
    }

    const vehicleData = {
      ...newVehicle,
      currentLocation: JSON.stringify([clickLocation.lng, clickLocation.lat]),
      assignedArea: JSON.stringify([]), // Will be set later
      lastUpdate: new Date(),
      assignedOfficerId: null
    };

    if (onAddVehicle) {
      onAddVehicle(vehicleData);
    }

    // Reset form
    setNewVehicle({
      vehicleId: '',
      licensePlate: '',
      vehicleType: 'patrol',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      status: 'available'
    });
    setClickLocation(null);
    setShowAddForm(false);
    onTrackingModeChange('view');
  };

  const handleModeChange = (mode) => {
    if (onTrackingModeChange) {
      onTrackingModeChange(mode);
    }
    if (mode === 'add') {
      setShowAddForm(true);
    } else {
      setShowAddForm(false);
    }
  };

  // Listen for map clicks when in add mode
  React.useEffect(() => {
    if (trackingMode === 'add') {
      const handleMapClick = (e) => {
        if (e.detail && e.detail.lat && e.detail.lng) {
          setClickLocation({ lat: e.detail.lat, lng: e.detail.lng });
        }
      };

      window.addEventListener('mapClick', handleMapClick);
      return () => window.removeEventListener('mapClick', handleMapClick);
    }
  }, [trackingMode]);

  return (
    <div className="vehicle-tracking-controls">
      <h5 style={{ margin: '0 0 8px 0', color: '#2c3e50', fontSize: '14px' }}>
        <Settings size={16} style={{ marginRight: '6px' }} />
        Vehicle Tracking
      </h5>
      
      <button 
        className={`tracking-control-btn ${trackingMode === 'view' ? 'active' : ''}`}
        onClick={() => handleModeChange('view')}
      >
        <Navigation size={14} />
        View Mode
      </button>
      
      <button 
        className={`tracking-control-btn ${trackingMode === 'add' ? 'active' : ''}`}
        onClick={() => handleModeChange('add')}
      >
        <Plus size={14} />
        Add Vehicle
      </button>
      
      <button 
        className={`tracking-control-btn ${trackingMode === 'track' ? 'active' : ''}`}
        onClick={() => handleModeChange('track')}
      >
        <Target size={14} />
        Track Vehicle
      </button>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="add-vehicle-form">
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
            {clickLocation ? (
              <span style={{ color: '#2ecc71' }}>
                <MapPin size={12} /> Location: {clickLocation.lat.toFixed(4)}, {clickLocation.lng.toFixed(4)}
              </span>
            ) : (
              <span style={{ color: '#e74c3c' }}>
                <MapPin size={12} /> Click on map to set location
              </span>
            )}
          </div>
          
          <input
            type="text"
            placeholder="Vehicle ID *"
            value={newVehicle.vehicleId}
            onChange={(e) => setNewVehicle({...newVehicle, vehicleId: e.target.value})}
            required
          />
          
          <input
            type="text"
            placeholder="License Plate *"
            value={newVehicle.licensePlate}
            onChange={(e) => setNewVehicle({...newVehicle, licensePlate: e.target.value})}
            required
          />
          
          <select
            value={newVehicle.vehicleType}
            onChange={(e) => setNewVehicle({...newVehicle, vehicleType: e.target.value})}
          >
            <option value="patrol">Patrol Car</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="k9">K9 Unit</option>
            <option value="special">Special Operations</option>
          </select>
          
          <div className="form-row">
            <input
              type="text"
              placeholder="Make"
              value={newVehicle.make}
              onChange={(e) => setNewVehicle({...newVehicle, make: e.target.value})}
            />
            <input
              type="text"
              placeholder="Model"
              value={newVehicle.model}
              onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
            />
          </div>
          
          <div className="form-row">
            <input
              type="number"
              placeholder="Year"
              value={newVehicle.year}
              onChange={(e) => setNewVehicle({...newVehicle, year: parseInt(e.target.value)})}
              min="1990"
              max={new Date().getFullYear() + 1}
            />
            <select
              value={newVehicle.status}
              onChange={(e) => setNewVehicle({...newVehicle, status: e.target.value})}
            >
              <option value="available">Available</option>
              <option value="on_patrol">On Patrol</option>
              <option value="responding">Responding</option>
              <option value="out_of_service">Out of Service</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
            <button 
              type="submit" 
              style={{ 
                flex: 1, 
                padding: '6px', 
                background: '#2ecc71', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              Add Vehicle
            </button>
            <button 
              type="button" 
              onClick={() => {
                setShowAddForm(false);
                handleModeChange('view');
              }}
              style={{ 
                padding: '6px 12px', 
                background: '#95a5a6', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default VehicleTrackingControls;