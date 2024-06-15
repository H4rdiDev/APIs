import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import express from 'express';
import path from 'path';

const app = express();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HardiDev-APIs',
      version: '1.0.0 BETA',
      description: 'Free API for everyone.',
      contact: {
        name: 'Developer',
        email: 'developer@example.com',
      },
      license: {
        name: 'Apache 2.0',
        url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./api/*.js'],
};

const specs = swaggerJsdoc(options);

const customCss = `
  .swagger-ui .topbar { 
    display: none !important; 
  }
`;

app.get('/api.ico', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'api.ico'));
});

app.use('/', express.static(path.join(process.cwd(), 'public')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss,
  customSiteTitle: 'HardiDev-APIs',
  customfavIcon: '/api.ico'
}));

export default app;