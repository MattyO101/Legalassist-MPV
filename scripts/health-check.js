const axios = require('axios');
const { table } = require('console');

const services = [
  { name: 'Auth Service', url: 'http://localhost:9000/health' },
  { name: 'Document Analysis Service', url: 'http://localhost:9001/health' },
  { name: 'Template Service', url: 'http://localhost:9002/health' },
  { name: 'Frontend', url: 'http://localhost:3000' },
];

const checkServices = async () => {
  console.log('Checking services health...\n');
  
  const results = [];
  
  for (const service of services) {
    try {
      const startTime = Date.now();
      const response = await axios.get(service.url, { timeout: 5000 });
      const endTime = Date.now();
      
      results.push({
        'Service': service.name,
        'Status': response.status === 200 ? 'UP' : 'DOWN',
        'Response Time': `${endTime - startTime}ms`,
        'Details': response.data?.status || 'N/A',
      });
    } catch (error) {
      results.push({
        'Service': service.name,
        'Status': 'DOWN',
        'Response Time': 'N/A',
        'Details': error.code === 'ECONNREFUSED' ? 'Connection refused' : error.message,
      });
    }
  }
  
  // Display results as a table
  table(results);
  
  // Check if all services are up
  const allServicesUp = results.every(result => result.Status === 'UP');
  
  if (allServicesUp) {
    console.log('\n✅ All services are up and running!');
  } else {
    console.log('\n❌ Some services are down. Please check the table above for details.');
    process.exit(1);
  }
};

checkServices().catch(error => {
  console.error('Error running health check:', error);
  process.exit(1);
}); 