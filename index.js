require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const initDB = require('./config/dbInit');

const fileuploadRoutes      = require("./routes/fileuploadRoutes");
const usersRoutes           = require('./routes/usersRoutes');
const siteconfigRoutes      = require('./routes/siteconfigRoutes');
const dashboardRoutes       = require('./routes/dashboardRoutes');
const homeBannerRoutes      = require('./routes/homeBannerRoutes');
const categoryRoutes        = require('./routes/categoryRoutes');
const brandRoutes           = require('./routes/brandRoutes');
const productRoutes         = require('./routes/productRoutes');
const customerRoutes        = require('./routes/customerRoutes');
const customerAddressRoutes = require('./routes/customerAddressRoutes');
const paymentSettingsRoutes = require('./routes/paymentSettingsRoutes');
const orderRoutes           = require('./routes/orderRoutes');
const promoBannerRoutes     = require('./routes/promoBannerRoutes');
const categoryPageRoutes    = require('./routes/categoryPageRoutes');
const policyRoutes          = require('./routes/policyRoutes');
const faqRoutes             = require('./routes/faqRoutes');
const contactRoutes         = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', true);

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));

app.use("/api/file",             fileuploadRoutes);
app.use('/api/users',            usersRoutes);
app.use('/api/siteconfig',       siteconfigRoutes);
app.use('/api/dashboard',        dashboardRoutes);
app.use('/api/homebanner',       homeBannerRoutes);
app.use('/api/category',         categoryRoutes);
app.use('/api/brand',            brandRoutes);
app.use('/api/product',          productRoutes);
app.use('/api/customer',         customerRoutes);
app.use('/api/customer-address', customerAddressRoutes);
app.use('/api/payment-settings', paymentSettingsRoutes);
app.use('/api/orders',           orderRoutes);
app.use('/api/promo-banners',    promoBannerRoutes);
app.use('/api/category-page',   categoryPageRoutes);
app.use('/api/policies',        policyRoutes);
app.use('/api/faq',             faqRoutes);
app.use('/api/contact',         contactRoutes);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ DB init failed, server not started:', err);
  process.exit(1);
});
