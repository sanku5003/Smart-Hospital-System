const Hospital = require('../models/Hospital');
const Token = require('../models/Token');

// In-memory directory of provisioned accounts (backed by DB seeds)
let PROVISIONED_CMOS = [
  {
    cmoId: 'CMO-UP-093',
    name: 'Dr. Sudhir Kumar',
    district: 'Jhansi, Uttar Pradesh',
    username: 'cmo_jhansi',
    status: 'ACTIVE',
    createdDate: new Date().toISOString().split('T')[0]
  }
];

let PROVISIONED_MITRAS = [
  {
    mitraId: 'GSM-101',
    name: 'Ramsewak Yadav',
    village: 'Babina Village (Jhansi)',
    phone: '+91 94500 12345',
    status: 'ACTIVE',
    createdDate: new Date().toISOString().split('T')[0]
  },
  {
    mitraId: 'GSM-102',
    name: 'Kamlesh Bundela',
    village: 'Mauranipur (Jhansi)',
    phone: '+91 94500 67890',
    status: 'ACTIVE',
    createdDate: new Date().toISOString().split('T')[0]
  }
];

// Get System Overview & User Directory
async function getSystemOverview(req, res) {
  try {
    const totalHospitals = await Hospital.countDocuments();
    const totalTokensProcessed = await Token.countDocuments();

    res.json({
      success: true,
      metrics: {
        totalHospitals: totalHospitals || 5,
        activeCmoOfficers: PROVISIONED_CMOS.length,
        registeredMitras: PROVISIONED_MITRAS.length,
        totalTokensProcessed: totalTokensProcessed || 42
      },
      directory: {
        cmos: PROVISIONED_CMOS,
        mitras: PROVISIONED_MITRAS
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Provision New CMO District Officer
async function provisionCmo(req, res) {
  try {
    const { name, district, username, password } = req.body;

    if (!name || !district || !username || !password) {
      return res.status(400).json({ success: false, message: 'All CMO fields are required' });
    }

    const newCmo = {
      cmoId: `CMO-UP-${Math.floor(100 + Math.random() * 900)}`,
      name,
      district,
      username,
      status: 'ACTIVE',
      createdDate: new Date().toISOString().split('T')[0]
    };

    PROVISIONED_CMOS.push(newCmo);

    res.json({
      success: true,
      message: `CMO Account Provisioned for ${name} (${district})`,
      cmo: newCmo
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Provision New Hospital Profile
async function provisionHospitalProfile(req, res) {
  try {
    const { name, address, city = 'Jhansi', area, phone, lat, lng, totalBeds = 100 } = req.body;

    if (!name || !address || !area) {
      return res.status(400).json({ success: false, message: 'Hospital Name, Address, and Area are required' });
    }

    const hospitalId = `HOSP-${Math.floor(100 + Math.random() * 900)}`;

    const newHospital = new Hospital({
      hospitalId,
      name,
      address,
      city,
      area: area || 'Civil Lines (Jhansi)',
      lat: Number(lat) || 25.4484,
      lng: Number(lng) || 78.5685,
      phone: phone || '+91 510 244 0000',
      beds: [
        { bedNumber: 'ICU-01', category: 'ICU', status: 'AVAILABLE' },
        { bedNumber: 'EMG-01', category: 'EMERGENCY', status: 'AVAILABLE' },
        { bedNumber: 'GEN-101', category: 'GENERAL', status: 'AVAILABLE' }
      ],
      doctors: [
        { name: 'Dr. Duty Medical Officer', department: 'General OPD', counter: 'Counter 1', status: 'AVAILABLE' }
      ]
    });

    await newHospital.save();

    res.json({
      success: true,
      message: `Hospital Profile Provisioned for ${name} (${hospitalId})`,
      hospital: newHospital
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Provision New Gram Swasthya Mitra
async function provisionMitra(req, res) {
  try {
    const { name, village, phone } = req.body;

    if (!name || !village || !phone) {
      return res.status(400).json({ success: false, message: 'Mitra Name, Village, and Phone are required' });
    }

    const newMitra = {
      mitraId: `GSM-${Math.floor(100 + Math.random() * 900)}`,
      name,
      village,
      phone,
      status: 'ACTIVE',
      createdDate: new Date().toISOString().split('T')[0]
    };

    PROVISIONED_MITRAS.push(newMitra);

    res.json({
      success: true,
      message: `Gram Swasthya Mitra Provisioned for ${name} (${village})`,
      mitra: newMitra
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getSystemOverview,
  provisionCmo,
  provisionHospitalProfile,
  provisionMitra
};
