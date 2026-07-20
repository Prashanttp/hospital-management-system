/* ============================================================
   CareSync Pro — Hospital Management Dashboard Controller
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- STATE ---
  let token = localStorage.getItem('token') || '';
  let userId = localStorage.getItem('userId') || '';
  let userRole = localStorage.getItem('userRole') || '';
  let currentAdminPage = 0;
  const adminPageSize = 5;
  let allAdminPatients = [];

  // --- API BASE URL ---
  const API_BASE = '/api/v1';

  // --- DOM ELEMENTS ---
  const authSection = document.getElementById('auth-section');
  const dashboardSection = document.getElementById('dashboard-section');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const toSignupLink = document.getElementById('to-signup');
  const toLoginLink = document.getElementById('to-login');
  const authTitle = document.getElementById('auth-title');
  const authSubtitle = document.getElementById('auth-subtitle');
  const authAlert = document.getElementById('auth-alert');
  const dashboardAlert = document.getElementById('dashboard-alert');
  const logoutBtn = document.getElementById('logout-btn');

  // Profile fields
  const profileName = document.getElementById('profile-name');
  const profileRoleBadge = document.getElementById('profile-role-badge');
  const userAvatar = document.getElementById('user-avatar');

  // Role Panels
  const panelPatient = document.getElementById('panel-patient');
  const panelDoctor = document.getElementById('panel-doctor');
  const panelAdmin = document.getElementById('panel-admin');

  // Patient view components
  const pEmail = document.getElementById('p-email');
  const pGender = document.getElementById('p-gender');
  const pDob = document.getElementById('p-dob');
  const pBlood = document.getElementById('p-blood');
  const insProvider = document.getElementById('ins-provider');
  const insPolicy = document.getElementById('ins-policy');
  const insValid = document.getElementById('ins-valid');
  const toggleInsuranceFormBtn = document.getElementById('toggle-insurance-form-btn');
  const insuranceForm = document.getElementById('insurance-form');
  const cancelInsuranceBtn = document.getElementById('cancel-insurance-btn');
  const patientAppointmentsList = document.getElementById('patient-appointments-list');
  const openAppointmentModalBtn = document.getElementById('open-appointment-modal-btn');
  const appointmentModal = document.getElementById('appointment-modal');
  const closeAppointmentModal = document.getElementById('close-appointment-modal');
  const apptDoctorSelect = document.getElementById('appt-doctor');
  const appointmentForm = document.getElementById('appointment-form');

  // Doctor view components
  const doctorAppointmentsList = document.getElementById('doctor-appointments-list');
  const consultationModal = document.getElementById('consultation-modal');
  const closeConsultationModal = document.getElementById('close-consultation-modal');
  const consultationForm = document.getElementById('consultation-form');
  const consultApptId = document.getElementById('consult-appt-id');
  const consultStatus = document.getElementById('consult-status');
  const consultPrescription = document.getElementById('consult-prescription');

  // Admin view components
  const statPatients = document.getElementById('stat-patients');
  const statAppointments = document.getElementById('stat-appointments');
  const statDoctors = document.getElementById('stat-doctors');
  const adminPatientsTableBody = document.getElementById('admin-patients-table-body');
  const adminPatientSearch = document.getElementById('admin-patient-search');
  const prevPageBtn = document.getElementById('prev-page-btn');
  const nextPageBtn = document.getElementById('next-page-btn');
  const pageIndicator = document.getElementById('page-indicator');
  const bloodGroupsList = document.getElementById('blood-groups-list');

  // Capstone Info Modal
  const capstoneInfoModal = document.getElementById('capstone-info-modal');
  const openCapstoneAuthBtn = document.getElementById('open-capstone-modal-auth');
  const openCapstoneDashBtn = document.getElementById('open-capstone-modal-dash');
  const closeCapstoneModal = document.getElementById('close-capstone-modal');

  // --- DEMO FILL BUTTONS ---
  document.querySelectorAll('.btn-demo-fill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const email = e.target.getAttribute('data-user');
      document.getElementById('login-username').value = email;
      document.getElementById('login-password').value = 'password123';
    });
  });

  // --- CAPSTONE MODAL LISTENERS ---
  if (openCapstoneAuthBtn) openCapstoneAuthBtn.addEventListener('click', showCapstoneModal);
  if (openCapstoneDashBtn) openCapstoneDashBtn.addEventListener('click', showCapstoneModal);
  if (closeCapstoneModal) closeCapstoneModal.addEventListener('click', () => capstoneInfoModal.classList.add('hidden'));

  async function showCapstoneModal() {
    capstoneInfoModal.classList.remove('hidden');
    try {
      const info = await apiCall('/public/project-info');
      if (info) {
        console.log('Project Info:', info);
      }
    } catch (e) {
      console.warn('Project info load:', e);
    }
  }

  // --- INITIAL CHECK ---
  if (token && userId) {
    showDashboard();
  } else {
    showAuth();
  }

  // --- NAVIGATION & SWITCHING PANELS ---
  toSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
    authTitle.textContent = 'Create Patient Profile';
    authSubtitle.textContent = 'Sign up to schedule appointments and manage care';
    clearAlerts();
  });

  toLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    authTitle.textContent = 'CareSync Pro';
    authSubtitle.textContent = 'Healthcare Operations & Clinical Analytics Platform';
    clearAlerts();
  });

  logoutBtn.addEventListener('click', logout);

  function showAuth() {
    authSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
  }

  function showDashboard() {
    authSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    determineRoleAndLoadData();
  }

  function logout() {
    localStorage.clear();
    token = '';
    userId = '';
    userRole = '';
    showAuth();
  }

  // --- HELPERS ---
  function clearAlerts() {
    authAlert.classList.add('hidden');
    authAlert.textContent = '';
    dashboardAlert.classList.add('hidden');
    dashboardAlert.textContent = '';
  }

  function showAlert(alertEl, msg, type = 'danger') {
    alertEl.textContent = msg;
    alertEl.className = `alert alert-${type}`;
    alertEl.classList.remove('hidden');
    setTimeout(() => {
      alertEl.classList.add('hidden');
    }, 6000);
  }

  // Generic fetch wrapper with auth header
  async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    options.headers = options.headers || {};
    options.headers['Content-Type'] = 'application/json';
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, options);
      if (response.status === 401 || response.status === 403) {
        logout();
        return null;
      }
      
      if (!response.ok) {
        let errorMsg = 'API request failed';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
        } catch (e) {}
        throw new Error(errorMsg);
      }

      if (response.status === 204) return true;
      return await response.json();
    } catch (err) {
      console.error('API Error:', err);
      throw err;
    }
  }

  // Parse JWT token
  function parseJwt(tokenString) {
    try {
      const base64Url = tokenString.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  // --- AUTHENTICATION FLOWS ---
  
  // Login Submit
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlerts();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
      const data = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });

      if (data && data.jwt) {
        token = data.jwt;
        userId = data.userId;
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        showDashboard();
      }
    } catch (err) {
      showAlert(authAlert, err.message);
    }
  });

  // Signup Submit (Register Patient)
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlerts();
    
    const email = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const name = document.getElementById('patient-name').value;
    const gender = document.getElementById('patient-gender').value;
    const bloodGroup = document.getElementById('patient-bloodgroup').value;
    const birthDate = document.getElementById('patient-dob').value;

    try {
      const signupData = await apiCall('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ username: email, password })
      });

      if (signupData) {
        const loginData = await apiCall('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ username: email, password })
        });

        if (loginData && loginData.jwt) {
          token = loginData.jwt;
          userId = loginData.userId;
          localStorage.setItem('token', token);
          localStorage.setItem('userId', userId);

          await apiCall('/patients', {
            method: 'POST',
            body: JSON.stringify({ name, email, gender, bloodGroup, birthDate })
          });

          showDashboard();
        }
      }
    } catch (err) {
      showAlert(authAlert, err.message);
    }
  });

  // --- DATA LOADING & INTERACTION PANEL LOGIC ---

  function determineRoleAndLoadData() {
    clearAlerts();
    if (!token) return;

    const payload = parseJwt(token);
    const username = payload ? payload.sub : '';
    
    if (username.startsWith('admin')) {
      userRole = 'ADMIN';
    } else if (username.includes('doctor') || username.includes('mehta') || username.includes('kapoor') || username.includes('nair')) {
      userRole = 'DOCTOR';
    } else {
      userRole = 'PATIENT';
    }
    
    localStorage.setItem('userRole', userRole);

    userAvatar.textContent = username ? username.substring(0, 2).toUpperCase() : 'U';
    profileRoleBadge.textContent = userRole;

    panelPatient.classList.add('hidden');
    panelDoctor.classList.add('hidden');
    panelAdmin.classList.add('hidden');

    if (userRole === 'PATIENT') {
      panelPatient.classList.remove('hidden');
      loadPatientDashboard(username);
    } else if (userRole === 'DOCTOR') {
      panelDoctor.classList.remove('hidden');
      loadDoctorDashboard(username);
    } else if (userRole === 'ADMIN') {
      panelAdmin.classList.remove('hidden');
      loadAdminDashboard();
    }
  }

  // --- PATIENT VIEWS & ACTIONS ---

  let currentPatientId = null;

  async function loadPatientDashboard(email) {
    try {
      const patient = await apiCall('/patients/profile');
      if (!patient) return;

      currentPatientId = patient.id;
      profileName.textContent = patient.name;
      
      pEmail.textContent = patient.email;
      pGender.textContent = patient.gender;
      pDob.textContent = patient.birthDate;
      pBlood.textContent = patient.bloodGroup.replace('_POSITIVE', '+').replace('_NEGATIVE', '-');

      if (patient.insurance) {
        insProvider.textContent = patient.insurance.provider;
        insPolicy.textContent = patient.insurance.policyNumber;
        insValid.textContent = patient.insurance.validUntil;
      } else {
        insProvider.textContent = 'None';
        insPolicy.textContent = 'None';
        insValid.textContent = 'None';
      }

      loadPatientAppointments(patient.appointments);
      loadDoctorDropdown();

    } catch (err) {
      showAlert(dashboardAlert, 'Failed to load health profile: ' + err.message);
    }
  }

  function loadPatientAppointments(appointments) {
    patientAppointmentsList.innerHTML = '';
    if (!appointments || appointments.length === 0) {
      patientAppointmentsList.innerHTML = `<p class="empty-state">No appointments scheduled.</p>`;
      return;
    }

    appointments.forEach(appt => {
      const apptEl = document.createElement('div');
      apptEl.className = 'appointment-item';
      
      const apptDate = new Date(appt.appointmentTime).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
      });

      const status = appt.status || 'SCHEDULED';
      const statusBadge = `<span class="badge-status badge-status-${status}">${status}</span>`;

      let prescriptionHtml = '';
      if (appt.prescription) {
        prescriptionHtml = `
          <div class="prescription-box">
            <h5>💊 Medical Prescription & Doctor Notes</h5>
            <p>${appt.prescription}</p>
          </div>
        `;
      }

      apptEl.innerHTML = `
        <div class="appt-info" style="width: 100%;">
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <span class="appt-time">📅 ${apptDate}</span>
            ${statusBadge}
          </div>
          <span class="appt-doctor">👨‍⚕️ ${appt.doctor ? appt.doctor.name : 'Unassigned'} (${appt.doctor ? appt.doctor.specialization : 'General'})</span>
          <span class="appt-reason"><strong>Reason:</strong> ${appt.reason}</span>
          ${prescriptionHtml}
        </div>
      `;
      patientAppointmentsList.appendChild(apptEl);
    });
  }

  async function loadDoctorDropdown() {
    try {
      const doctors = await apiCall('/public/doctors');
      apptDoctorSelect.innerHTML = '<option value="">-- Select Specialist Doctor --</option>';
      if (doctors) {
        doctors.forEach(doc => {
          const opt = document.createElement('option');
          opt.value = doc.id;
          opt.textContent = `Dr. ${doc.name} — ${doc.specialization}`;
          apptDoctorSelect.appendChild(opt);
        });
      }
    } catch (err) {
      console.error('Failed to load doctors dropdown:', err);
    }
  }

  appointmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const doctorId = document.getElementById('appt-doctor').value;
    const appointmentTime = document.getElementById('appt-time').value;
    const reason = document.getElementById('appt-reason').value;

    try {
      await apiCall('/patients/appointments', {
        method: 'POST',
        body: JSON.stringify({
          doctorId: parseInt(doctorId),
          patientId: currentPatientId,
          appointmentTime,
          reason
        })
      });

      appointmentModal.classList.add('hidden');
      appointmentForm.reset();
      showAlert(dashboardAlert, 'Consultation appointment successfully booked!', 'success');
      determineRoleAndLoadData();
    } catch (err) {
      showAlert(dashboardAlert, 'Failed to book appointment: ' + err.message);
    }
  });

  toggleInsuranceFormBtn.addEventListener('click', () => {
    insuranceForm.classList.remove('hidden');
    toggleInsuranceFormBtn.classList.add('hidden');
  });

  cancelInsuranceBtn.addEventListener('click', () => {
    insuranceForm.classList.add('hidden');
    toggleInsuranceFormBtn.classList.remove('hidden');
    insuranceForm.reset();
  });

  insuranceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const provider = document.getElementById('ins-form-provider').value;
    const policyNumber = document.getElementById('ins-form-policy').value;
    const validUntil = document.getElementById('ins-form-valid').value;

    try {
      await apiCall(`/patients/${currentPatientId}/insurance`, {
        method: 'POST',
        body: JSON.stringify({ provider, policyNumber, validUntil })
      });

      insuranceForm.classList.add('hidden');
      toggleInsuranceFormBtn.classList.remove('hidden');
      insuranceForm.reset();
      showAlert(dashboardAlert, 'Insurance policy successfully updated!', 'success');
      determineRoleAndLoadData();
    } catch (err) {
      showAlert(dashboardAlert, 'Failed to assign insurance: ' + err.message);
    }
  });

  openAppointmentModalBtn.addEventListener('click', () => appointmentModal.classList.remove('hidden'));
  closeAppointmentModal.addEventListener('click', () => appointmentModal.classList.add('hidden'));

  // --- DOCTOR VIEWS & ACTIONS ---

  async function loadDoctorDashboard(email) {
    try {
      const appointments = await apiCall('/doctors/appointments');
      if (appointments && appointments.length > 0) {
        profileName.textContent = appointments[0].doctor ? appointments[0].doctor.name : 'Doctor Workspace';
      } else {
        profileName.textContent = email;
      }
      loadDoctorAppointments(appointments);
    } catch (err) {
      showAlert(dashboardAlert, 'Failed to load doctor appointments: ' + err.message);
    }
  }

  function loadDoctorAppointments(appointments) {
    doctorAppointmentsList.innerHTML = '';
    if (!appointments || appointments.length === 0) {
      doctorAppointmentsList.innerHTML = `<p class="empty-state">No patient appointments scheduled today.</p>`;
      return;
    }

    appointments.forEach(appt => {
      const apptEl = document.createElement('div');
      apptEl.className = 'appointment-item';
      
      const apptDate = new Date(appt.appointmentTime).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
      });

      const status = appt.status || 'SCHEDULED';
      const statusBadge = `<span class="badge-status badge-status-${status}">${status}</span>`;

      let prescriptionHtml = '';
      if (appt.prescription) {
        prescriptionHtml = `
          <div class="prescription-box">
            <h5>💊 Prescription Notes Attached</h5>
            <p>${appt.prescription}</p>
          </div>
        `;
      }

      apptEl.innerHTML = `
        <div class="appt-info" style="width: 100%;">
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <span class="appt-time">📅 ${apptDate}</span>
            ${statusBadge}
          </div>
          <span class="appt-doctor">👤 Patient Reason: ${appt.reason}</span>
          ${prescriptionHtml}
          <div style="margin-top: 0.75rem;">
            <button class="btn btn-primary btn-sm open-consult-btn" data-id="${appt.id}" data-status="${status}" data-prescription="${appt.prescription || ''}">
              ✍️ Write Prescription & Update Status
            </button>
          </div>
        </div>
      `;
      doctorAppointmentsList.appendChild(apptEl);
    });

    // Attach listeners for doctor consultation modal
    document.querySelectorAll('.open-consult-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const st = e.target.getAttribute('data-status');
        const rx = e.target.getAttribute('data-prescription');

        consultApptId.value = id;
        consultStatus.value = st;
        consultPrescription.value = rx;
        consultationModal.classList.remove('hidden');
      });
    });
  }

  if (closeConsultationModal) {
    closeConsultationModal.addEventListener('click', () => consultationModal.classList.add('hidden'));
  }

  if (consultationForm) {
    consultationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const apptId = consultApptId.value;
      const status = consultStatus.value;
      const prescription = consultPrescription.value;

      try {
        await apiCall(`/doctors/appointments/${apptId}`, {
          method: 'PUT',
          body: JSON.stringify({ status, prescription })
        });

        consultationModal.classList.add('hidden');
        showAlert(dashboardAlert, 'Consultation status & prescription saved successfully!', 'success');
        determineRoleAndLoadData();
      } catch (err) {
        showAlert(dashboardAlert, 'Failed to update consultation: ' + err.message);
      }
    });
  }

  // --- ADMIN VIEWS & ACTIONS ---

  async function loadAdminDashboard() {
    profileName.textContent = 'Hospital Admin';
    loadAdminStats();
    loadAdminPatients();
  }

  async function loadAdminStats() {
    try {
      const stats = await apiCall('/patients/stats');
      if (stats) {
        statPatients.textContent = stats.totalPatients;
        statAppointments.textContent = stats.totalAppointments;
        statDoctors.textContent = stats.totalDoctors;

        bloodGroupsList.innerHTML = '';
        if (stats.bloodGroups && stats.bloodGroups.length > 0) {
          stats.bloodGroups.forEach(bg => {
            const bgName = bg.bloodGroupType.replace('_POSITIVE', '+').replace('_NEGATIVE', '-');
            const bgEl = document.createElement('div');
            bgEl.className = 'blood-item';
            bgEl.innerHTML = `
              <span class="blood-group-badge tag tag-blood">${bgName}</span>
              <span class="blood-count"><strong>${bg.count}</strong> registered</span>
            `;
            bloodGroupsList.appendChild(bgEl);
          });
        } else {
          bloodGroupsList.innerHTML = '<p class="empty-state">No blood group records found.</p>';
        }
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    }
  }

  async function loadAdminPatients() {
    adminPatientsTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Loading patient records...</td></tr>';
    
    try {
      const data = await apiCall(`/admin/patients?page=${currentAdminPage}&size=${adminPageSize}`);
      allAdminPatients = data || [];
      renderAdminPatients(allAdminPatients);
    } catch (err) {
      adminPatientsTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error: ${err.message}</td></tr>`;
    }
  }

  function renderAdminPatients(patients) {
    adminPatientsTableBody.innerHTML = '';
    if (patients && patients.length > 0) {
      patients.forEach(patient => {
        const bg = patient.bloodGroup ? patient.bloodGroup.replace('_POSITIVE', '+').replace('_NEGATIVE', '-') : 'N/A';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${patient.id}</td>
          <td><strong>${patient.name}</strong></td>
          <td>${patient.gender}</td>
          <td>${patient.birthDate}</td>
          <td><span class="tag tag-blood">${bg}</span></td>
          <td><button class="btn btn-secondary btn-sm delete-patient-btn" data-id="${patient.id}">Delete</button></td>
        `;
        adminPatientsTableBody.appendChild(tr);
      });

      document.querySelectorAll('.delete-patient-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.target.getAttribute('data-id');
          if (confirm(`Delete patient record ID: ${id}?`)) {
            try {
              await apiCall(`/patients/${id}`, { method: 'DELETE' });
              showAlert(dashboardAlert, `Patient record ${id} deleted.`, 'success');
              loadAdminDashboard();
            } catch (err) {
              showAlert(dashboardAlert, 'Failed to delete patient: ' + err.message);
            }
          }
        });
      });

      prevPageBtn.disabled = currentAdminPage === 0;
      nextPageBtn.disabled = patients.length < adminPageSize;
      pageIndicator.textContent = `Page ${currentAdminPage + 1}`;
    } else {
      adminPatientsTableBody.innerHTML = '<tr><td colspan="6" class="text-center empty-state">No patient records found.</td></tr>';
      nextPageBtn.disabled = true;
      prevPageBtn.disabled = currentAdminPage === 0;
    }
  }

  if (adminPatientSearch) {
    adminPatientSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = allAdminPatients.filter(p => p.name.toLowerCase().includes(q) || (p.bloodGroup && p.bloodGroup.toLowerCase().includes(q)));
      renderAdminPatients(filtered);
    });
  }

  prevPageBtn.addEventListener('click', () => {
    if (currentAdminPage > 0) {
      currentAdminPage--;
      loadAdminPatients();
    }
  });

  nextPageBtn.addEventListener('click', () => {
    currentAdminPage++;
    loadAdminPatients();
  });

  window.addEventListener('click', (e) => {
    if (e.target === appointmentModal) appointmentModal.classList.add('hidden');
    if (e.target === consultationModal) consultationModal.classList.add('hidden');
    if (e.target === capstoneInfoModal) capstoneInfoModal.classList.add('hidden');
  });
});
