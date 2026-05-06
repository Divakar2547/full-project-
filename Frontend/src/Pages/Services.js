import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { serviceAPI } from "../utils/api";

const Services = () => {
  const { services: contextServices } = useOutletContext() || {};
  const [services, setServices] = useState(contextServices || []);
  const [loading, setLoading] = useState(!contextServices);

  useEffect(() => {
    if (!contextServices) {
      const fetchServices = async () => {
        try {
          const data = await serviceAPI.getServices();
          setServices(data);
        } catch (error) {
          console.error('Error fetching services:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchServices();
    }
  }, [contextServices]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Loading Services...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Our Services</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {services.map((service) => (
          <div key={service._id || service.packageId} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#f9f9f9'
          }}>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>{service.name}</h3>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff', marginBottom: '10px' }}>
              ₹{typeof service.price === 'number' ? service.price : service.price}
            </p>
            <p style={{ color: '#666', marginBottom: '15px' }}>{service.description}</p>
            {service.duration && (
              <p style={{ fontSize: '14px', color: '#888' }}>Duration: {service.duration}</p>
            )}
            {service.features && service.features.length > 0 && (
              <div style={{ marginTop: '15px' }}>
                <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>Features:</h4>
                <ul style={{ paddingLeft: '20px' }}>
                  {service.features.map((feature, index) => (
                    <li key={index} style={{ marginBottom: '4px', fontSize: '14px' }}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      {services.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>
          No services available at the moment.
        </p>
      )}
    </div>
  );
};

export default Services;