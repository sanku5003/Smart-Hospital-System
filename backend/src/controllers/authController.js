const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_medpulse_jhansi_2026';

const DEMO_SUPERADMIN_CREDENTIALS = {
  username: 'superadmin',
  password: 'superadmin123',
  name: 'State Health Administrator (UP Health Ministry)',
  role: 'SUPER_ADMIN'
};

const DEMO_HOSPITAL_CREDENTIALS = [
  { username: 'mlb_admin', password: 'hospital123', hospitalId: 'HOSP-001', name: 'MLB Medical College Jhansi' },
  { username: 'civil_admin', password: 'hospital123', hospitalId: 'HOSP-002', name: 'District Hospital Jhansi (Civil)' },
  { username: 'stjude_admin', password: 'hospital123', hospitalId: 'HOSP-003', name: "St. Jude's Hospital Jhansi" },
  { username: 'nirmal_admin', password: 'hospital123', hospitalId: 'HOSP-004', name: 'Nirmal Hospital Jhansi' },
  { username: 'sudha_admin', password: 'hospital123', hospitalId: 'HOSP-005', name: 'Sudha Heart Institute Jhansi' }
];

const DEMO_CMO_CREDENTIALS = {
  username: 'cmo_jhansi',
  password: 'cmojhansi123',
  name: 'Dr. Sudhir Kumar (CMO Jhansi)',
  designation: 'Chief Medical Officer & District Health Director',
  district: 'Jhansi, Uttar Pradesh'
};

// Super Admin JWT Login
async function superAdminLogin(req, res) {
  try {
    const { username, password } = req.body;
    if (username.trim() !== DEMO_SUPERADMIN_CREDENTIALS.username || password.trim() !== DEMO_SUPERADMIN_CREDENTIALS.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Super Admin Credentials. Try: superadmin / superadmin123'
      });
    }

    const payload = {
      username: DEMO_SUPERADMIN_CREDENTIALS.username,
      name: DEMO_SUPERADMIN_CREDENTIALS.name,
      role: 'SUPER_ADMIN'
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      success: true,
      token,
      user: payload
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Hospital Staff Login with JWT
async function hospitalLogin(req, res) {
  try {
    const { username, password } = req.body;
    const match = DEMO_HOSPITAL_CREDENTIALS.find(
      c => c.username === username.trim() && c.password === password.trim()
    );

    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Hospital Username or Password. Try demo: mlb_admin / hospital123'
      });
    }

    const payload = {
      role: 'HOSPITAL',
      username: match.username,
      hospitalId: match.hospitalId,
      hospitalName: match.name
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      success: true,
      token,
      user: payload
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// CMO District Admin Login with JWT
async function cmoLogin(req, res) {
  try {
    const { username, password } = req.body;

    if (username.trim() !== DEMO_CMO_CREDENTIALS.username || password.trim() !== DEMO_CMO_CREDENTIALS.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid CMO Credentials. Try demo: cmo_jhansi / cmojhansi123'
      });
    }

    const payload = {
      role: 'CMO_ADMIN',
      ...DEMO_CMO_CREDENTIALS
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      success: true,
      token,
      user: payload
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// JWT Middleware Verification
function verifyJwtToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access Denied: Missing JWT Token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or Expired JWT Token' });
  }
}

module.exports = {
  superAdminLogin,
  hospitalLogin,
  cmoLogin,
  verifyJwtToken
};
