/**
 * ===================================================================
 * SMART STUDENT PERFORMANCE ANALYTICS DASHBOARD
 * Core JavaScript Application Controller
 * ===================================================================
 */

// Global Application Namespace
const app = (() => {
  'use strict';

  // LocalStorage Keys
  const STORAGE_KEYS = {
    STUDENTS: 'sspad_student_records',
    SETTINGS: 'sspad_app_settings',
    THEME: 'sspad_app_theme',
    GOALS: 'sspad_student_goals'
  };

  // Subjects List
  const SUBJECTS = ['mathematics', 'physics', 'chemistry', 'programming', 'english'];
  const SUBJECT_LABELS = {
    mathematics: 'Mathematics',
    physics: 'Physics',
    chemistry: 'Chemistry',
    programming: 'Programming',
    english: 'English'
  };

  // State
  let students = [];
  let currentSort = { column: 'totalMarks', direction: 'desc' };
  let activeStudentForGoal = 'IT001';
  let charts = {};
  let currentEditingStudentId = null;
  let confirmCallback = null;

  // Initial Sample Dataset (25 Realistic Student Records)
  // Calibrated so that Class Average is ~78.6%, Attendance is ~92%,
  // Distribution: 6 Excellent, 12 Good, 5 Average, 2 Needs Improvement.
  const DEFAULT_STUDENTS = [
    {
      id: 'stud-1',
      name: 'Rohit Kumar',
      rollNo: 'IT001',
      department: 'Information Technology',
      semester: '5',
      attendance: 96,
      marks: { mathematics: 98, physics: 96, chemistry: 98, programming: 100, english: 100 }
    },
    {
      id: 'stud-2',
      name: 'Priya S',
      rollNo: 'IT002',
      department: 'Information Technology',
      semester: '5',
      attendance: 94,
      marks: { mathematics: 92, physics: 88, chemistry: 85, programming: 95, english: 90 }
    },
    {
      id: 'stud-3',
      name: 'Ananya Sharma',
      rollNo: 'IT006',
      department: 'Computer Science',
      semester: '5',
      attendance: 98,
      marks: { mathematics: 95, physics: 90, chemistry: 88, programming: 96, english: 93 }
    },
    {
      id: 'stud-4',
      name: 'Karthik R',
      rollNo: 'IT009',
      department: 'Information Technology',
      semester: '5',
      attendance: 95,
      marks: { mathematics: 94, physics: 89, chemistry: 87, programming: 94, english: 92 }
    },
    {
      id: 'stud-5',
      name: 'Sneha Patel',
      rollNo: 'IT010',
      department: 'Computer Science',
      semester: '5',
      attendance: 96,
      marks: { mathematics: 91, physics: 92, chemistry: 86, programming: 95, english: 90 }
    },
    {
      id: 'stud-6',
      name: 'Rahul Verma',
      rollNo: 'IT007',
      department: 'Information Technology',
      semester: '5',
      attendance: 93,
      marks: { mathematics: 90, physics: 88, chemistry: 89, programming: 93, english: 90 }
    },
    {
      id: 'stud-7',
      name: 'Kavya P',
      rollNo: 'IT014',
      department: 'Information Technology',
      semester: '5',
      attendance: 94,
      marks: { mathematics: 88, physics: 85, chemistry: 84, programming: 90, english: 87 }
    },
    {
      id: 'stud-8',
      name: 'Pooja Nair',
      rollNo: 'IT011',
      department: 'Electronics & Comm',
      semester: '5',
      attendance: 95,
      marks: { mathematics: 89, physics: 84, chemistry: 80, programming: 88, english: 85 }
    },
    {
      id: 'stud-9',
      name: 'Vikram',
      rollNo: 'IT003',
      department: 'Information Technology',
      semester: '5',
      attendance: 90,
      marks: { mathematics: 85, physics: 82, chemistry: 80, programming: 88, english: 85 }
    },
    {
      id: 'stud-10',
      name: 'Deepa S',
      rollNo: 'IT016',
      department: 'Computer Science',
      semester: '5',
      attendance: 92,
      marks: { mathematics: 86, physics: 82, chemistry: 78, programming: 87, english: 84 }
    },
    {
      id: 'stud-11',
      name: 'Divya M',
      rollNo: 'IT008',
      department: 'Information Technology',
      semester: '5',
      attendance: 92,
      marks: { mathematics: 84, physics: 80, chemistry: 79, programming: 85, english: 84 }
    },
    {
      id: 'stud-12',
      name: 'Amit Shah',
      rollNo: 'IT012',
      department: 'Computer Science',
      semester: '5',
      attendance: 91,
      marks: { mathematics: 85, physics: 78, chemistry: 76, programming: 84, english: 82 }
    },
    {
      id: 'stud-13',
      name: 'Aravind B',
      rollNo: 'IT017',
      department: 'Information Technology',
      semester: '5',
      attendance: 90,
      marks: { mathematics: 83, physics: 79, chemistry: 75, programming: 82, english: 82 }
    },
    {
      id: 'stud-14',
      name: 'Sneha R',
      rollNo: 'IT004',
      department: 'Information Technology',
      semester: '5',
      attendance: 92,
      marks: { mathematics: 80, physics: 78, chemistry: 74, programming: 86, english: 80 }
    },
    {
      id: 'stud-15',
      name: 'Harish N',
      rollNo: 'IT015',
      department: 'Electronics & Comm',
      semester: '5',
      attendance: 93,
      marks: { mathematics: 82, physics: 76, chemistry: 74, programming: 83, english: 80 }
    },
    {
      id: 'stud-16',
      name: 'Manoj K',
      rollNo: 'IT013',
      department: 'Information Technology',
      semester: '5',
      attendance: 92,
      marks: { mathematics: 81, physics: 75, chemistry: 74, programming: 82, english: 80 }
    },
    {
      id: 'stud-17',
      name: 'Ritu Raj',
      rollNo: 'IT018',
      department: 'Computer Science',
      semester: '5',
      attendance: 91,
      marks: { mathematics: 79, physics: 76, chemistry: 72, programming: 80, english: 78 }
    },
    {
      id: 'stud-18',
      name: 'Suresh G',
      rollNo: 'IT019',
      department: 'Information Technology',
      semester: '5',
      attendance: 90,
      marks: { mathematics: 78, physics: 74, chemistry: 72, programming: 80, english: 77 }
    },
    {
      id: 'stud-19',
      name: 'Arun K',
      rollNo: 'IT005',
      department: 'Information Technology',
      semester: '5',
      attendance: 78,
      marks: { mathematics: 70, physics: 72, chemistry: 68, programming: 75, english: 75 }
    },
    {
      id: 'stud-20',
      name: 'Preeti D',
      rollNo: 'IT021',
      department: 'Information Technology',
      semester: '5',
      attendance: 88,
      marks: { mathematics: 74, physics: 70, chemistry: 66, programming: 74, english: 71 }
    },
    {
      id: 'stud-21',
      name: 'Swetha T',
      rollNo: 'IT020',
      department: 'Electronics & Comm',
      semester: '5',
      attendance: 85,
      marks: { mathematics: 72, physics: 68, chemistry: 64, programming: 70, english: 68 }
    },
    {
      id: 'stud-22',
      name: 'Vijay M',
      rollNo: 'IT022',
      department: 'Information Technology',
      semester: '5',
      attendance: 82,
      marks: { mathematics: 68, physics: 64, chemistry: 60, programming: 68, english: 66 }
    },
    {
      id: 'stud-23',
      name: 'Naveen K',
      rollNo: 'IT023',
      department: 'Computer Science',
      semester: '5',
      attendance: 76,
      marks: { mathematics: 66, physics: 62, chemistry: 58, programming: 68, english: 65 }
    },
    {
      id: 'stud-24',
      name: 'Sanjay V',
      rollNo: 'IT024',
      department: 'Information Technology',
      semester: '5',
      attendance: 71, // Shortage < 75%
      marks: { mathematics: 56, physics: 52, chemistry: 48, programming: 58, english: 56 }
    },
    {
      id: 'stud-25',
      name: 'Rajesh Kumar',
      rollNo: 'IT025',
      department: 'Information Technology',
      semester: '5',
      attendance: 68, // Shortage < 75%
      marks: { mathematics: 50, physics: 46, chemistry: 44, programming: 52, english: 48 } // Average < 50%
    }
  ];

  // Default Institute Settings
  const DEFAULT_SETTINGS = {
    collegeName: 'Government College of Engineering & Technology',
    department: 'Department of Information Technology',
    academicYear: '2024 - 2025',
    semester: 'Semester 5 (Final Year Pre-Eval)'
  };

  /**
   * Initialize Application
   */
  function init() {
    loadSettings();
    loadStudents();
    loadTheme();
    setupEventListeners();
    updateDateDisplay();
    renderAll();
    setupGlobalSearch();
  }

  /**
   * Load students from LocalStorage or seed default data
   */
  function loadStudents() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (stored) {
        students = JSON.parse(stored);
      } else {
        students = JSON.parse(JSON.stringify(DEFAULT_STUDENTS));
        saveStudents();
      }
    } catch (err) {
      console.error('Failed to load students from LocalStorage', err);
      students = JSON.parse(JSON.stringify(DEFAULT_STUDENTS));
    }
  }

  /**
   * Save students to LocalStorage
   */
  function saveStudents() {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (err) {
      console.error('Failed to save students to LocalStorage', err);
    }
  }

  /**
   * Calculate student statistical metrics
   */
  function calculateStudentStats(student) {
    const marksObj = student.marks || {};
    let total = 0;
    SUBJECTS.forEach(sub => {
      total += Number(marksObj[sub] || 0);
    });

    const maxTotal = SUBJECTS.length * 100;
    const percentage = Number(((total / maxTotal) * 100).toFixed(1));

    // Grade logic
    let grade = 'F';
    let status = 'Needs Improvement';

    if (percentage >= 90) {
      grade = 'A+';
      status = 'Excellent';
    } else if (percentage >= 80) {
      grade = 'A';
      status = 'Good';
    } else if (percentage >= 75) {
      grade = 'B+';
      status = 'Good';
    } else if (percentage >= 65) {
      grade = 'B';
      status = 'Average';
    } else if (percentage >= 50) {
      grade = 'C';
      status = 'Average';
    } else {
      grade = 'F';
      status = 'Needs Improvement';
    }

    return {
      totalMarks: total,
      maxMarks: maxTotal,
      percentage,
      grade,
      status
    };
  }

  /**
   * Calculate aggregate metrics across entire student cohort
   */
  function getCohortMetrics() {
    if (!students || students.length === 0) {
      return {
        totalStudents: 0,
        averageMarks: 0,
        averageAttendance: 0,
        topPerformer: { name: 'None', percentage: 0 },
        distribution: { excellent: 0, good: 0, average: 0, needsImp: 0 },
        subjectAverages: { mathematics: 0, physics: 0, chemistry: 0, programming: 0, english: 0 },
        highestScore: 0,
        lowestScore: 0,
        highestStudent: null,
        lowestStudent: null,
        topSubject: 'None',
        weakSubject: 'None'
      };
    }

    let totalMarksSum = 0;
    let totalAttendanceSum = 0;
    let highestPct = -1;
    let topStudent = null;
    let lowestPct = 999;
    let lowestStudent = null;

    const distribution = { excellent: 0, good: 0, average: 0, needsImp: 0 };
    const subjectSums = { mathematics: 0, physics: 0, chemistry: 0, programming: 0, english: 0 };

    students.forEach(st => {
      const stats = calculateStudentStats(st);
      totalMarksSum += stats.percentage;
      totalAttendanceSum += Number(st.attendance || 0);

      if (stats.percentage > highestPct) {
        highestPct = stats.percentage;
        topStudent = { ...st, ...stats };
      }
      if (stats.percentage < lowestPct) {
        lowestPct = stats.percentage;
        lowestStudent = { ...st, ...stats };
      }

      if (stats.percentage >= 90) distribution.excellent++;
      else if (stats.percentage >= 75) distribution.good++;
      else if (stats.percentage >= 60) distribution.average++;
      else distribution.needsImp++;

      SUBJECTS.forEach(sub => {
        subjectSums[sub] += Number(st.marks[sub] || 0);
      });
    });

    const count = students.length;
    const avgMarks = (totalMarksSum / count).toFixed(1);
    const avgAtt = Math.round(totalAttendanceSum / count);

    const subjectAverages = {};
    let topSub = 'mathematics';
    let weakSub = 'mathematics';
    let maxSubAvg = -1;
    let minSubAvg = 999;

    SUBJECTS.forEach(sub => {
      const avg = Math.round(subjectSums[sub] / count);
      subjectAverages[sub] = avg;
      if (avg > maxSubAvg) {
        maxSubAvg = avg;
        topSub = sub;
      }
      if (avg < minSubAvg) {
        minSubAvg = avg;
        weakSub = sub;
      }
    });

    return {
      totalStudents: count,
      averageMarks: avgMarks,
      averageAttendance: avgAtt,
      topPerformer: topStudent || { name: 'N/A', percentage: 0 },
      distribution,
      subjectAverages,
      highestScore: topStudent ? topStudent.totalMarks : 0,
      lowestScore: lowestStudent ? lowestStudent.totalMarks : 0,
      highestStudent: topStudent,
      lowestStudent: lowestStudent,
      topSubject: SUBJECT_LABELS[topSub],
      topSubjectAvg: maxSubAvg,
      weakSubject: SUBJECT_LABELS[weakSub],
      weakSubjectAvg: minSubAvg
    };
  }

  /**
   * Render all application components
   */
  function renderAll() {
    renderDashboard();
    renderStudentManagement();
    renderAnalyticsView();
    renderInsightsView();
    renderGoalTrackerView();
    renderTopPerformers();
    renderAttendanceView();
  }

  /**
   * ===================================================================
   * 1. DASHBOARD VIEW CONTROLLER
   * ===================================================================
   */
  function renderDashboard() {
    const metrics = getCohortMetrics();

    // 4 Summary Metric Cards
    document.getElementById('dashTotalStudents').textContent = metrics.totalStudents;
    document.getElementById('dashAverageMarks').textContent = `${metrics.averageMarks}%`;
    document.getElementById('dashAttendanceRate').textContent = `${metrics.averageAttendance}%`;
    document.getElementById('dashTopPerformer').textContent = metrics.topPerformer.name;
    document.getElementById('dashTopPercentage').textContent = `${metrics.topPerformer.percentage}%`;

    // Doughnut center text & legend counts
    document.getElementById('donutCenterVal').textContent = `${metrics.averageMarks}%`;
    document.getElementById('countExcellent').textContent = metrics.distribution.excellent;
    document.getElementById('countGood').textContent = metrics.distribution.good;
    document.getElementById('countAverage').textContent = metrics.distribution.average;
    document.getElementById('countNeedsImp').textContent = metrics.distribution.needsImp;

    // Render Charts
    renderSubjectWiseBarChart(metrics.subjectAverages);
    renderOverallDoughnutChart(metrics.distribution);
    renderPerformanceTrendChart();

    // Render Student Performance Table (First 5 students)
    renderDashboardStudentTable();

    // Render Performance Insights Preview
    renderDashboardInsightsPreview(metrics);

    // Render Goal Tracker Summary Widget
    renderDashboardGoalTrackerWidget();
  }

  /**
   * Render Subject-wise Bar Chart (Class Avg vs Top Performer/Selected)
   */
  function renderSubjectWiseBarChart(subjectAverages) {
    const ctx = document.getElementById('subjectWiseChart');
    if (!ctx) return;

    if (charts.subjectWise) {
      charts.subjectWise.destroy();
    }

    const labels = ['Mathematics', 'Physics', 'Chemistry', 'Programming', 'English'];
    const classAvgData = [
      subjectAverages.mathematics || 82,
      subjectAverages.physics || 76,
      subjectAverages.chemistry || 68,
      subjectAverages.programming || 70,
      subjectAverages.english || 78
    ];

    // Reference student (Rohit Kumar or first student)
    const refStudent = students[0] || { marks: { mathematics: 90, physics: 80, chemistry: 75, programming: 85, english: 88 } };
    const refData = [
      refStudent.marks.mathematics,
      refStudent.marks.physics,
      refStudent.marks.chemistry,
      refStudent.marks.programming,
      refStudent.marks.english
    ];

    charts.subjectWise = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Class Average',
            data: classAvgData,
            backgroundColor: '#1d68d8',
            borderRadius: 6,
            barPercentage: 0.65,
            categoryPercentage: 0.7
          },
          {
            label: 'Your Performance',
            data: refData,
            backgroundColor: '#74b3f7',
            borderRadius: 6,
            barPercentage: 0.65,
            categoryPercentage: 0.7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            padding: 10,
            callbacks: {
              label: (item) => ` ${item.dataset.label}: ${item.raw} / 100`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { stepSize: 20, color: '#94a3b8' },
            grid: { color: 'rgba(226, 232, 240, 0.6)' }
          },
          x: {
            ticks: { color: '#64748b', font: { weight: '600' } },
            grid: { display: false }
          }
        }
      }
    });
  }

  /**
   * Render Overall Performance Doughnut Chart
   */
  function renderOverallDoughnutChart(distribution) {
    const ctx = document.getElementById('overallDoughnutChart');
    if (!ctx) return;

    if (charts.overallDonut) {
      charts.overallDonut.destroy();
    }

    charts.overallDonut = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Excellent', 'Good', 'Average', 'Needs Improvement'],
        datasets: [{
          data: [
            distribution.excellent,
            distribution.good,
            distribution.average,
            distribution.needsImp
          ],
          backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
          borderWidth: 3,
          borderColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#111827' : '#ffffff',
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '76%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (item) => ` ${item.label}: ${item.raw} Students`
            }
          }
        }
      }
    });
  }

  /**
   * Render Performance Trend Line Chart
   */
  function renderPerformanceTrendChart() {
    const ctx = document.getElementById('performanceTrendChart');
    if (!ctx) return;

    if (charts.trend) {
      charts.trend.destroy();
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
    const youTrend = [68, 77, 80, 85, 91];
    const classAvgTrend = [59, 67, 70, 75, 78];

    charts.trend = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'You / Top Student',
            data: youTrend,
            borderColor: '#1d4ed8',
            backgroundColor: '#1d4ed8',
            pointBackgroundColor: '#1d4ed8',
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.35,
            borderWidth: 2.5
          },
          {
            label: 'Class Average',
            data: classAvgTrend,
            borderColor: '#93c5fd',
            backgroundColor: '#93c5fd',
            pointBackgroundColor: '#93c5fd',
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.35,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            min: 50,
            max: 100,
            ticks: { stepSize: 10, color: '#94a3b8' },
            grid: { color: 'rgba(226, 232, 240, 0.6)' }
          },
          x: {
            ticks: { color: '#64748b', font: { weight: '600' } },
            grid: { display: false }
          }
        }
      }
    });
  }

  /**
   * Render Dashboard Students Table (top 5 rows)
   */
  function renderDashboardStudentTable() {
    const tbody = document.getElementById('dashStudentTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const displayList = students.slice(0, 5);

    displayList.forEach((st, index) => {
      const stats = calculateStudentStats(st);
      const tr = document.createElement('tr');
      tr.style.cursor = 'pointer';
      tr.title = 'Click to view complete student profile';
      tr.onclick = () => openStudentDetailsModal(st.id);

      const statusClass = stats.status.toLowerCase().replace(/\s+/g, '-');

      tr.innerHTML = `
        <td><strong>${index + 1}</strong></td>
        <td>
          <div class="table-student-name">
            <div class="student-row-avatar">${st.name.charAt(0)}</div>
            <span>${st.name}</span>
          </div>
        </td>
        <td>${st.rollNo}</td>
        <td>${stats.totalMarks} / ${stats.maxMarks}</td>
        <td><strong>${stats.percentage}%</strong></td>
        <td><span class="grade-badge">${stats.grade}</span></td>
        <td><span class="status-badge ${statusClass}">${stats.status}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  /**
   * Render Dashboard Smart Insights Preview
   */
  function renderDashboardInsightsPreview(metrics) {
    const list = document.getElementById('dashInsightsList');
    if (!list) return;

    list.innerHTML = `
      <li>
        <i class="fa-solid fa-circle-check text-success"></i>
        <span>Class is performing exceptionally well in <strong>${metrics.topSubject}</strong> (Avg: ${metrics.topSubjectAvg}%).</span>
      </li>
      <li>
        <i class="fa-solid fa-triangle-exclamation text-warning"></i>
        <span>Focus more on <strong>${metrics.weakSubject}</strong> (lowest score average across cohort).</span>
      </li>
      <li>
        <i class="fa-solid fa-circle-check text-success"></i>
        <span>Cohort average attendance is healthy at <strong>${metrics.averageAttendance}%</strong>.</span>
      </li>
      <li>
        <i class="fa-solid fa-lightbulb text-primary"></i>
        <span><strong>${metrics.distribution.needsImp} students</strong> require immediate academic mentoring.</span>
      </li>
    `;
  }

  /**
   * Render Dashboard Goal Tracker summary widget
   */
  function renderDashboardGoalTrackerWidget() {
    const storedGoals = getStoredGoals();
    const target = storedGoals.benchmarkTarget || 450;
    const current = 398; // Cohort benchmark current average out of 500
    const pct = Math.min(100, Math.round((current / target) * 100));
    const diff = Math.max(0, target - current);

    const input = document.getElementById('dashTargetMarksInput');
    if (input) input.value = target;

    const fraction = document.getElementById('goalProgressFraction');
    if (fraction) fraction.textContent = `${current} / ${target}`;

    const bar = document.getElementById('goalProgressBar');
    if (bar) bar.style.width = `${pct}%`;

    const diffText = document.getElementById('goalDifferenceText');
    if (diffText) diffText.textContent = diff > 0 ? `Need ${diff} marks to achieve target` : 'Target achieved!';

    const pctText = document.getElementById('goalPercentageText');
    if (pctText) pctText.textContent = `${pct}%`;
  }

  /**
   * ===================================================================
   * 2. STUDENT MANAGEMENT CONTROLLER
   * ===================================================================
   */
  function renderStudentManagement() {
    const tbody = document.getElementById('studentManagementTableBody');
    if (!tbody) return;

    const searchTerm = (document.getElementById('studentSearchFilter')?.value || '').toLowerCase().trim();
    const deptFilter = document.getElementById('filterDept')?.value || 'All';
    const gradeFilter = document.getElementById('filterGrade')?.value || 'All';
    const statusFilter = document.getElementById('filterStatus')?.value || 'All';

    let filtered = students.filter(st => {
      const stats = calculateStudentStats(st);

      // Search match
      const matchSearch = !searchTerm ||
        st.name.toLowerCase().includes(searchTerm) ||
        st.rollNo.toLowerCase().includes(searchTerm);

      // Department filter
      const matchDept = deptFilter === 'All' || st.department === deptFilter;

      // Grade filter
      const matchGrade = gradeFilter === 'All' || stats.grade === gradeFilter;

      // Status filter
      const matchStatus = statusFilter === 'All' || stats.status === statusFilter;

      return matchSearch && matchDept && matchGrade && matchStatus;
    });

    // Sorting
    filtered.sort((a, b) => {
      const statsA = calculateStudentStats(a);
      const statsB = calculateStudentStats(b);

      let valA, valB;
      switch (currentSort.column) {
        case 'name':
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          break;
        case 'rollNo':
          valA = a.rollNo.toLowerCase();
          valB = b.rollNo.toLowerCase();
          break;
        case 'department':
          valA = a.department.toLowerCase();
          valB = b.department.toLowerCase();
          break;
        case 'semester':
          valA = Number(a.semester);
          valB = Number(b.semester);
          break;
        case 'totalMarks':
          valA = statsA.totalMarks;
          valB = statsB.totalMarks;
          break;
        case 'percentage':
          valA = statsA.percentage;
          valB = statsB.percentage;
          break;
        case 'attendance':
          valA = Number(a.attendance);
          valB = Number(b.attendance);
          break;
        case 'status':
          valA = statsA.percentage;
          valB = statsB.percentage;
          break;
        default:
          valA = statsA.totalMarks;
          valB = statsB.totalMarks;
      }

      if (valA < valB) return currentSort.direction === 'asc' ? -1 : 1;
      if (valA > valB) return currentSort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    // Update counts
    const filteredCount = document.getElementById('studentFilteredCount');
    const totalCount = document.getElementById('studentTotalCount');
    if (filteredCount) filteredCount.textContent = filtered.length;
    if (totalCount) totalCount.textContent = students.length;

    tbody.innerHTML = '';

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" class="text-center" style="padding: 2.5rem;">
            <i class="fa-solid fa-user-slash" style="font-size: 2rem; color: #94a3b8; margin-bottom: 0.5rem; display: block;"></i>
            <strong>No students match the selected filter criteria.</strong>
            <p class="text-muted small">Try clearing your filters or adding a new student record.</p>
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach(st => {
      const stats = calculateStudentStats(st);
      const statusClass = stats.status.toLowerCase().replace(/\s+/g, '-');
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td><strong>${st.rollNo}</strong></td>
        <td>
          <div class="table-student-name">
            <div class="student-row-avatar">${st.name.charAt(0)}</div>
            <div>
              <span>${st.name}</span>
            </div>
          </div>
        </td>
        <td>${st.department}</td>
        <td>Sem ${st.semester}</td>
        <td>
          <span class="badge-subtle" title="M: ${st.marks.mathematics}, P: ${st.marks.physics}, C: ${st.marks.chemistry}, Prg: ${st.marks.programming}, Eng: ${st.marks.english}">
            M:${st.marks.mathematics} | P:${st.marks.physics} | C:${st.marks.chemistry}
          </span>
        </td>
        <td><strong>${stats.totalMarks}</strong> / 500</td>
        <td>
          <strong>${stats.percentage}%</strong>
          <span class="grade-badge" style="margin-left: 6px;">(${stats.grade})</span>
        </td>
        <td>
          <span class="badge ${st.attendance >= 75 ? 'badge-success' : 'badge-danger'}">
            ${st.attendance}%
          </span>
        </td>
        <td><span class="status-badge ${statusClass}">${stats.status}</span></td>
        <td>
          <div class="table-actions">
            <button class="btn-icon-action" title="View Student Profile" onclick="app.openStudentDetailsModal('${st.id}')">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="btn-icon-action" title="Edit Student" onclick="app.editStudentInline('${st.id}')">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn-icon-action delete" title="Delete Student" onclick="app.confirmDeleteStudent('${st.id}')">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  /**
   * Sort table column toggle
   */
  function sortTable(column) {
    if (currentSort.column === column) {
      currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      currentSort.column = column;
      currentSort.direction = 'desc';
    }
    renderStudentManagement();
  }

  /**
   * Reset filters
   */
  function resetFilters() {
    const search = document.getElementById('studentSearchFilter');
    if (search) search.value = '';
    const dept = document.getElementById('filterDept');
    if (dept) dept.value = 'All';
    const grade = document.getElementById('filterGrade');
    if (grade) grade.value = 'All';
    const status = document.getElementById('filterStatus');
    if (status) status.value = 'All';
    renderStudentManagement();
    showToast('Filters reset to default', 'info');
  }

  /**
   * Helper to calculate total, percentage, grade, and status from 5 marks
   */
  function calculateMarksHelper(math, phys, chem, prog, eng) {
    const m = Math.max(0, Math.min(100, Number(math) || 0));
    const p = Math.max(0, Math.min(100, Number(phys) || 0));
    const c = Math.max(0, Math.min(100, Number(chem) || 0));
    const pr = Math.max(0, Math.min(100, Number(prog) || 0));
    const e = Math.max(0, Math.min(100, Number(eng) || 0));

    const total = m + p + c + pr + e;
    const percentage = Number(((total / 500) * 100).toFixed(1));

    let grade = 'F';
    let status = 'Needs Improvement';
    let statusClass = 'needs-improvement';

    if (percentage >= 90) {
      grade = 'A+';
      status = 'Excellent';
      statusClass = 'excellent';
    } else if (percentage >= 80) {
      grade = 'A';
      status = 'Good';
      statusClass = 'good';
    } else if (percentage >= 75) {
      grade = 'B+';
      status = 'Good';
      statusClass = 'good';
    } else if (percentage >= 65) {
      grade = 'B';
      status = 'Average';
      statusClass = 'average';
    } else if (percentage >= 50) {
      grade = 'C';
      status = 'Average';
      statusClass = 'average';
    } else {
      grade = 'F';
      status = 'Needs Improvement';
      statusClass = 'needs-improvement';
    }

    return { total, percentage, grade, status, statusClass };
  }

  /**
   * Update real-time auto-calculation preview in inline form
   */
  function updateInlineAutoCalc() {
    const math = document.getElementById('inlineMath')?.value || 0;
    const phys = document.getElementById('inlinePhysics')?.value || 0;
    const chem = document.getElementById('inlineChemistry')?.value || 0;
    const prog = document.getElementById('inlineProgramming')?.value || 0;
    const eng = document.getElementById('inlineEnglish')?.value || 0;

    const res = calculateMarksHelper(math, phys, chem, prog, eng);

    const totalEl = document.getElementById('inlineAutoTotal');
    if (totalEl) totalEl.textContent = `${res.total} / 500`;

    const pctEl = document.getElementById('inlineAutoPercent');
    if (pctEl) pctEl.textContent = `${res.percentage}%`;

    const gradeEl = document.getElementById('inlineAutoGrade');
    if (gradeEl) gradeEl.textContent = res.grade;

    const statusEl = document.getElementById('inlineAutoStatus');
    if (statusEl) {
      statusEl.textContent = res.status;
      statusEl.className = `status-badge ${res.statusClass}`;
    }
  }

  /**
   * Update real-time auto-calculation preview in modal form
   */
  function updateModalAutoCalc() {
    const math = document.getElementById('formMath')?.value || 0;
    const phys = document.getElementById('formPhysics')?.value || 0;
    const chem = document.getElementById('formChemistry')?.value || 0;
    const prog = document.getElementById('formProgramming')?.value || 0;
    const eng = document.getElementById('formEnglish')?.value || 0;

    const res = calculateMarksHelper(math, phys, chem, prog, eng);

    const totalEl = document.getElementById('modalAutoTotal');
    if (totalEl) totalEl.textContent = `${res.total} / 500`;

    const pctEl = document.getElementById('modalAutoPercent');
    if (pctEl) pctEl.textContent = `${res.percentage}%`;

    const gradeEl = document.getElementById('modalAutoGrade');
    if (gradeEl) gradeEl.textContent = res.grade;

    const statusEl = document.getElementById('modalAutoStatus');
    if (statusEl) {
      statusEl.textContent = res.status;
      statusEl.className = `status-badge ${res.statusClass}`;
    }
  }

  /**
   * Save Individual Student from Inline Form
   */
  function saveInlineStudent() {
    const nameInput = document.getElementById('inlineStudentName');
    const rollInput = document.getElementById('inlineRollNo');
    const attInput = document.getElementById('inlineAttendance');
    const editingId = document.getElementById('inlineStudentId').value;

    const name = nameInput.value.trim();
    const rollNo = rollInput.value.trim().toUpperCase();
    const department = document.getElementById('inlineDepartment').value;
    const semester = document.getElementById('inlineSemester').value;
    const attendance = Number(attInput.value);

    const math = Number(document.getElementById('inlineMath').value);
    const phys = Number(document.getElementById('inlinePhysics').value);
    const chem = Number(document.getElementById('inlineChemistry').value);
    const prog = Number(document.getElementById('inlineProgramming').value);
    const eng = Number(document.getElementById('inlineEnglish').value);

    // Validation
    if (!name) {
      showToast('Please enter the student\'s full name.', 'warning');
      nameInput.focus();
      return;
    }

    if (!rollNo) {
      showToast('Please enter a valid Roll Number.', 'warning');
      rollInput.focus();
      return;
    }

    if (isNaN(attendance) || attendance < 0 || attendance > 100) {
      showToast('Attendance percentage must be between 0 and 100%.', 'warning');
      attInput.focus();
      return;
    }

    const marksArray = [
      { name: 'Mathematics', val: math, id: 'inlineMath' },
      { name: 'Physics', val: phys, id: 'inlinePhysics' },
      { name: 'Chemistry', val: chem, id: 'inlineChemistry' },
      { name: 'Programming', val: prog, id: 'inlineProgramming' },
      { name: 'English', val: eng, id: 'inlineEnglish' }
    ];

    for (const item of marksArray) {
      if (isNaN(item.val) || item.val < 0 || item.val > 100) {
        showToast(`Please enter a valid score (0-100) for ${item.name}.`, 'warning');
        document.getElementById(item.id)?.focus();
        return;
      }
    }

    // 7. Duplicate roll number prevention
    const duplicate = students.find(s => s.rollNo.trim().toUpperCase() === rollNo && s.id !== editingId);
    if (duplicate) {
      showToast(`Roll Number "${rollNo}" is already assigned to ${duplicate.name}! Each student must have a unique roll number.`, 'danger');
      rollInput.focus();
      rollInput.style.borderColor = 'var(--danger)';
      setTimeout(() => rollInput.style.borderColor = '', 3000);
      return;
    }

    const studentRecord = {
      id: editingId || `stud-${Date.now()}`,
      name,
      rollNo,
      department,
      semester,
      attendance,
      marks: {
        mathematics: math,
        physics: phys,
        chemistry: chem,
        programming: prog,
        english: eng
      }
    };

    if (editingId) {
      const idx = students.findIndex(s => s.id === editingId);
      if (idx !== -1) {
        students[idx] = studentRecord;
        showToast(`Updated record for ${name} (${rollNo}). Dashboard & rankings updated!`, 'success');
      }
      cancelEditMode();
    } else {
      // 1. Add individual student to list
      students.unshift(studentRecord);
      showToast(`Student ${name} (${rollNo}) added successfully! Dashboard & rankings updated.`, 'success');
      resetInlineStudentForm();
    }

    // 5. Save in LocalStorage
    saveStudents();

    // 3 & 4. Update dashboard statistics, charts, rankings, insights
    renderAll();
  }

  /**
   * Edit student record using the Inline Form
   */
  function editStudentInline(studentId) {
    const st = students.find(s => s.id === studentId);
    if (!st) return;

    // Switch to Student Management view if not active
    switchView('students');

    // Populate inline form
    document.getElementById('inlineStudentId').value = st.id;
    document.getElementById('inlineStudentName').value = st.name;
    document.getElementById('inlineRollNo').value = st.rollNo;
    document.getElementById('inlineDepartment').value = st.department;
    document.getElementById('inlineSemester').value = st.semester;
    document.getElementById('inlineAttendance').value = st.attendance;

    document.getElementById('inlineMath').value = st.marks.mathematics;
    document.getElementById('inlinePhysics').value = st.marks.physics;
    document.getElementById('inlineChemistry').value = st.marks.chemistry;
    document.getElementById('inlineProgramming').value = st.marks.programming;
    document.getElementById('inlineEnglish').value = st.marks.english;

    // Trigger auto calc
    updateInlineAutoCalc();

    // Change UI to Edit Mode
    document.getElementById('inlineFormTitle').textContent = `Edit Student Record: ${st.name}`;
    const badge = document.getElementById('formModeBadge');
    badge.className = 'badge badge-warning';
    badge.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Editing Student (${st.rollNo})`;

    document.getElementById('inlineSubmitBtn').innerHTML = `<i class="fa-solid fa-check"></i> Update Student Record`;
    document.getElementById('inlineCancelEditBtn').style.display = 'inline-flex';

    const card = document.getElementById('inlineStudentCard');
    card.classList.add('edit-mode');

    // Ensure body is visible
    const body = document.getElementById('inlineFormBody');
    body.style.display = 'block';
    const chevron = document.getElementById('toggleFormChevron');
    if (chevron) chevron.className = 'fa-solid fa-chevron-up';

    // Smooth scroll to form
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('inlineStudentName').focus();

    showToast(`Editing ${st.name} (${st.rollNo}). Update marks and click "Update Student Record".`, 'info');
  }

  /**
   * Cancel Edit Mode in Inline Form
   */
  function cancelEditMode() {
    resetInlineStudentForm();
    document.getElementById('inlineStudentId').value = '';
    document.getElementById('inlineFormTitle').textContent = 'Add Individual Student';
    
    const badge = document.getElementById('formModeBadge');
    badge.className = 'badge badge-primary';
    badge.innerHTML = `<i class="fa-solid fa-circle-plus"></i> New Student Entry`;

    document.getElementById('inlineSubmitBtn').innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Save Student Record`;
    document.getElementById('inlineCancelEditBtn').style.display = 'none';

    document.getElementById('inlineStudentCard')?.classList.remove('edit-mode');
  }

  /**
   * Reset Inline Form
   */
  function resetInlineStudentForm() {
    document.getElementById('inlineStudentForm')?.reset();
    document.getElementById('inlineStudentId').value = '';
    document.getElementById('inlineDepartment').value = 'Information Technology';
    document.getElementById('inlineSemester').value = '5';
    updateInlineAutoCalc();

    if (document.getElementById('inlineStudentCard')?.classList.contains('edit-mode')) {
      cancelEditMode();
    }
  }

  /**
   * Toggle Inline Form Collapse/Expand
   */
  function toggleInlineForm() {
    const body = document.getElementById('inlineFormBody');
    const chevron = document.getElementById('toggleFormChevron');
    if (!body) return;

    if (body.style.display === 'none') {
      body.style.display = 'block';
      if (chevron) chevron.className = 'fa-solid fa-chevron-up';
    } else {
      body.style.display = 'none';
      if (chevron) chevron.className = 'fa-solid fa-chevron-down';
    }
  }

  /**
   * 8. Delete Sample Data (keeps user-added records, or confirms clearing sample data)
   */
  function confirmDeleteSampleData() {
    openConfirmModal(
      'Delete Sample Data',
      'Are you sure you want to delete the default sample student records (IT001 - IT025)? This will clean your dashboard so you can manage purely your own student entries.',
      () => {
        // Filter out sample student records (stud-1 to stud-25)
        const sampleIds = new Set(DEFAULT_STUDENTS.map(s => s.id));
        const sampleRolls = new Set(DEFAULT_STUDENTS.map(s => s.rollNo.toUpperCase()));

        const beforeCount = students.length;
        students = students.filter(s => !sampleIds.has(s.id) && !sampleRolls.has(s.rollNo.toUpperCase()));
        const deletedCount = beforeCount - students.length;

        saveStudents();
        renderAll();

        if (deletedCount > 0) {
          showToast(`Removed ${deletedCount} sample student records. Dashboard updated!`, 'success');
        } else {
          // If all remaining students are sample or if user already had only sample students
          students = [];
          saveStudents();
          renderAll();
          showToast('Sample student records deleted.', 'info');
        }
      }
    );
  }

  /**
   * Open Add Student Modal
   */
  function openAddStudentModal() {
    currentEditingStudentId = null;
    document.getElementById('studentModalTitle').textContent = 'Add New Student Record';
    document.getElementById('studentDataForm').reset();
    document.getElementById('formStudentId').value = '';
    document.getElementById('formDepartment').value = 'Information Technology';
    document.getElementById('formSemester').value = '5';
    updateModalAutoCalc();
    document.getElementById('studentFormModal').classList.add('show');
  }

  /**
   * Open Edit Student Modal
   */
  function openEditStudentModal(id) {
    const st = students.find(s => s.id === id);
    if (!st) return;

    currentEditingStudentId = id;
    document.getElementById('studentModalTitle').textContent = `Edit Details: ${st.name}`;
    document.getElementById('formStudentId').value = st.id;
    document.getElementById('formStudentName').value = st.name;
    document.getElementById('formRollNo').value = st.rollNo;
    document.getElementById('formDepartment').value = st.department;
    document.getElementById('formSemester').value = st.semester;
    document.getElementById('formAttendance').value = st.attendance;

    document.getElementById('formMath').value = st.marks.mathematics;
    document.getElementById('formPhysics').value = st.marks.physics;
    document.getElementById('formChemistry').value = st.marks.chemistry;
    document.getElementById('formProgramming').value = st.marks.programming;
    document.getElementById('formEnglish').value = st.marks.english;

    updateModalAutoCalc();
    document.getElementById('studentFormModal').classList.add('show');
  }

  /**
   * Close Student Modal
   */
  function closeStudentModal() {
    document.getElementById('studentFormModal').classList.remove('show');
    currentEditingStudentId = null;
  }

  /**
   * Save Student Form (Add or Edit Modal)
   */
  function saveStudentForm() {
    const name = document.getElementById('formStudentName').value.trim();
    const rollNo = document.getElementById('formRollNo').value.trim().toUpperCase();
    const department = document.getElementById('formDepartment').value;
    const semester = document.getElementById('formSemester').value;
    const attendance = Number(document.getElementById('formAttendance').value);

    const math = Number(document.getElementById('formMath').value);
    const phys = Number(document.getElementById('formPhysics').value);
    const chem = Number(document.getElementById('formChemistry').value);
    const prog = Number(document.getElementById('formProgramming').value);
    const eng = Number(document.getElementById('formEnglish').value);

    // Validation
    if (!name || !rollNo) {
      showToast('Please enter both student name and roll number', 'warning');
      return;
    }

    if (attendance < 0 || attendance > 100) {
      showToast('Attendance must be between 0 and 100%', 'warning');
      return;
    }

    const marksArray = [math, phys, chem, prog, eng];
    if (marksArray.some(m => isNaN(m) || m < 0 || m > 100)) {
      showToast('All subject marks must be valid numbers between 0 and 100', 'warning');
      return;
    }

    // Check duplicate roll number
    const duplicate = students.find(s => s.rollNo.toUpperCase() === rollNo && s.id !== currentEditingStudentId);
    if (duplicate) {
      showToast(`Roll number "${rollNo}" already exists for ${duplicate.name}!`, 'danger');
      return;
    }

    const studentRecord = {
      id: currentEditingStudentId || `stud-${Date.now()}`,
      name,
      rollNo,
      department,
      semester,
      attendance,
      marks: {
        mathematics: math,
        physics: phys,
        chemistry: chem,
        programming: prog,
        english: eng
      }
    };

    if (currentEditingStudentId) {
      const idx = students.findIndex(s => s.id === currentEditingStudentId);
      if (idx !== -1) {
        students[idx] = studentRecord;
        showToast(`Updated record for ${name} (${rollNo})`, 'success');
      }
    } else {
      students.unshift(studentRecord);
      showToast(`Student ${name} added successfully!`, 'success');
    }

    saveStudents();
    closeStudentModal();
    renderAll();
  }

  /**
   * Confirm Delete Student
   */
  function confirmDeleteStudent(id) {
    const st = students.find(s => s.id === id);
    if (!st) return;

    openConfirmModal(
      'Delete Student Record',
      `Are you sure you want to permanently delete the student record for <strong>${st.name}</strong> (${st.rollNo})?`,
      () => {
        students = students.filter(s => s.id !== id);
        saveStudents();
        renderAll();
        showToast(`Record for ${st.name} has been deleted.`, 'danger');
      }
    );
  }

  /**
   * ===================================================================
   * 3. PERFORMANCE ANALYTICS VIEW CONTROLLER
   * ===================================================================
   */
  function renderAnalyticsView() {
    const metrics = getCohortMetrics();

    // Populate Metrics Row
    const classHighest = document.getElementById('metricClassHighest');
    if (classHighest) classHighest.textContent = `${metrics.highestScore} / 500`;

    const highestHolder = document.getElementById('metricHighestHolder');
    if (highestHolder && metrics.highestStudent) {
      highestHolder.textContent = `${metrics.highestStudent.name} (${metrics.highestStudent.percentage}%)`;
    }

    const classLowest = document.getElementById('metricClassLowest');
    if (classLowest) classLowest.textContent = `${metrics.lowestScore} / 500`;

    const lowestHolder = document.getElementById('metricLowestHolder');
    if (lowestHolder && metrics.lowestStudent) {
      lowestHolder.textContent = `${metrics.lowestStudent.name} (${metrics.lowestStudent.percentage}%)`;
    }

    const topSub = document.getElementById('metricTopSubject');
    if (topSub) topSub.textContent = metrics.topSubject;

    const topSubAvg = document.getElementById('metricTopSubjectAvg');
    if (topSubAvg) topSubAvg.textContent = `${metrics.topSubjectAvg}% Class Average`;

    const weakSub = document.getElementById('metricWeakSubject');
    if (weakSub) weakSub.textContent = metrics.weakSubject;

    const weakSubAvg = document.getElementById('metricWeakSubjectAvg');
    if (weakSubAvg) weakSubAvg.textContent = `${metrics.weakSubjectAvg}% Class Average`;

    // Populate Analytics Student Dropdown
    const select = document.getElementById('analyticsStudentSelect');
    if (select) {
      const currentVal = select.value;
      select.innerHTML = `<option value="class">Whole Class Average</option>`;
      students.forEach(st => {
        const opt = document.createElement('option');
        opt.value = st.id;
        opt.textContent = `${st.name} (${st.rollNo})`;
        select.appendChild(opt);
      });
      if (currentVal && select.querySelector(`option[value="${currentVal}"]`)) {
        select.value = currentVal;
      }
    }

    updateAnalyticsCharts();
  }

  /**
   * Update Analytics Charts based on selected student dropdown
   */
  function updateAnalyticsCharts() {
    const select = document.getElementById('analyticsStudentSelect');
    const selectedVal = select ? select.value : 'class';
    const metrics = getCohortMetrics();

    // Subject Bar Chart
    const ctxBar = document.getElementById('analyticsSubjectChart');
    if (ctxBar) {
      if (charts.analyticsSubject) charts.analyticsSubject.destroy();

      const labels = ['Mathematics', 'Physics', 'Chemistry', 'Programming', 'English'];
      const classData = [
        metrics.subjectAverages.mathematics,
        metrics.subjectAverages.physics,
        metrics.subjectAverages.chemistry,
        metrics.subjectAverages.programming,
        metrics.subjectAverages.english
      ];

      const datasets = [
        {
          label: 'Class Average',
          data: classData,
          backgroundColor: '#3b82f6',
          borderRadius: 6
        }
      ];

      if (selectedVal !== 'class') {
        const student = students.find(s => s.id === selectedVal);
        if (student) {
          datasets.push({
            label: student.name,
            data: [
              student.marks.mathematics,
              student.marks.physics,
              student.marks.chemistry,
              student.marks.programming,
              student.marks.english
            ],
            backgroundColor: '#10b981',
            borderRadius: 6
          });
        }
      }

      charts.analyticsSubject = new Chart(ctxBar, {
        type: 'bar',
        data: { labels, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, max: 100 }
          }
        }
      });
    }

    // Radar Chart: Subject Competency
    const ctxRadar = document.getElementById('analyticsRadarChart');
    if (ctxRadar) {
      if (charts.analyticsRadar) charts.analyticsRadar.destroy();

      const targetStudent = selectedVal !== 'class'
        ? students.find(s => s.id === selectedVal)
        : students[0];

      const radarData = targetStudent ? [
        targetStudent.marks.mathematics,
        targetStudent.marks.physics,
        targetStudent.marks.chemistry,
        targetStudent.marks.programming,
        targetStudent.marks.english
      ] : [80, 75, 70, 85, 80];

      charts.analyticsRadar = new Chart(ctxRadar, {
        type: 'radar',
        data: {
          labels: ['Mathematics', 'Physics', 'Chemistry', 'Programming', 'English'],
          datasets: [
            {
              label: targetStudent ? targetStudent.name : 'Sample Student',
              data: radarData,
              backgroundColor: 'rgba(37, 99, 235, 0.25)',
              borderColor: '#1d4ed8',
              pointBackgroundColor: '#1d4ed8'
            },
            {
              label: 'Class Benchmark',
              data: [
                metrics.subjectAverages.mathematics,
                metrics.subjectAverages.physics,
                metrics.subjectAverages.chemistry,
                metrics.subjectAverages.programming,
                metrics.subjectAverages.english
              ],
              backgroundColor: 'rgba(148, 163, 184, 0.15)',
              borderColor: '#94a3b8',
              pointBackgroundColor: '#94a3b8'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              min: 0,
              max: 100,
              ticks: { stepSize: 20 }
            }
          }
        }
      });
    }

    // Attendance Correlation Matrix Chart
    const ctxCorr = document.getElementById('attendanceCorrelationChart');
    if (ctxCorr) {
      if (charts.attendanceCorr) charts.attendanceCorr.destroy();

      const scatterData = students.map(st => {
        const stats = calculateStudentStats(st);
        return {
          x: st.attendance,
          y: stats.percentage,
          name: st.name
        };
      });

      charts.attendanceCorr = new Chart(ctxCorr, {
        type: 'scatter',
        data: {
          datasets: [{
            label: 'Students',
            data: scatterData,
            backgroundColor: '#1d4ed8',
            pointRadius: 6,
            pointHoverRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.raw.name}: Attendance: ${ctx.raw.x}%, Marks: ${ctx.raw.y}%`
              }
            }
          },
          scales: {
            x: {
              title: { display: true, text: 'Attendance Percentage (%)' },
              min: 50,
              max: 100
            },
            y: {
              title: { display: true, text: 'Academic Percentage (%)' },
              min: 40,
              max: 100
            }
          }
        }
      });
    }

    // Grade Distribution Bar Chart
    const ctxGradeBar = document.getElementById('analyticsGradeBarChart');
    if (ctxGradeBar) {
      if (charts.gradeBar) charts.gradeBar.destroy();

      charts.gradeBar = new Chart(ctxGradeBar, {
        type: 'bar',
        data: {
          labels: ['Excellent (>=90%)', 'Good (75-89%)', 'Average (60-74%)', 'Needs Imp (<60%)'],
          datasets: [{
            label: 'Number of Students',
            data: [
              metrics.distribution.excellent,
              metrics.distribution.good,
              metrics.distribution.average,
              metrics.distribution.needsImp
            ],
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 2 } }
          }
        }
      });
    }
  }

  /**
   * ===================================================================
   * 4. STUDENT INSIGHTS VIEW (RULE-BASED ENGINE)
   * ===================================================================
   */
  function renderInsightsView() {
    const metrics = getCohortMetrics();

    // 1. Low Marks (<50%)
    const lowMarks = students.filter(st => {
      const stats = calculateStudentStats(st);
      return stats.percentage < 50;
    });

    const lowMarksCount = document.getElementById('lowMarksCountTag');
    if (lowMarksCount) lowMarksCount.textContent = lowMarks.length;

    const lowMarksList = document.getElementById('lowMarksStudentList');
    if (lowMarksList) {
      lowMarksList.innerHTML = '';
      if (lowMarks.length === 0) {
        lowMarksList.innerHTML = `<span class="text-success small"><i class="fa-solid fa-circle-check"></i> Great news! No students scoring below 50%.</span>`;
      } else {
        lowMarks.forEach(st => {
          const stats = calculateStudentStats(st);
          const chip = document.createElement('div');
          chip.className = 'student-chip';
          chip.innerHTML = `<strong>${st.name}</strong> (${st.rollNo}) - ${stats.percentage}%`;
          chip.onclick = () => openStudentDetailsModal(st.id);
          lowMarksList.appendChild(chip);
        });
      }
    }

    // 2. Attendance Shortage (<75%)
    const lowAttendance = students.filter(st => st.attendance < 75);
    const lowAttCount = document.getElementById('lowAttendanceCountTag');
    if (lowAttCount) lowAttCount.textContent = lowAttendance.length;

    const lowAttList = document.getElementById('lowAttendanceStudentList');
    if (lowAttList) {
      lowAttList.innerHTML = '';
      if (lowAttendance.length === 0) {
        lowAttList.innerHTML = `<span class="text-success small"><i class="fa-solid fa-circle-check"></i> All students satisfy minimum 75% attendance criteria.</span>`;
      } else {
        lowAttendance.forEach(st => {
          const chip = document.createElement('div');
          chip.className = 'student-chip';
          chip.innerHTML = `<strong>${st.name}</strong> (${st.rollNo}) - <span class="text-danger">${st.attendance}%</span>`;
          chip.onclick = () => openStudentDetailsModal(st.id);
          lowAttList.appendChild(chip);
        });
      }
    }

    // 3. Weakest Subject Focus
    const weakSubTag = document.getElementById('weakSubjectTag');
    if (weakSubTag) weakSubTag.textContent = metrics.weakSubject;

    const weakDetails = document.getElementById('subjectWeaknessDetails');
    if (weakDetails) {
      weakDetails.innerHTML = `
        <div style="font-size: 0.88rem;">
          <p>Class average for <strong>${metrics.weakSubject}</strong> is currently at <strong>${metrics.weakSubjectAvg}%</strong>.</p>
          <p style="margin-top: 4px; color: var(--text-muted);">
            Recommended Action: Schedule review sessions and practical problem-solving labs before mid-terms.
          </p>
        </div>
      `;
    }

    // 4. High Achievers (>=90%)
    const highAchievers = students.filter(st => {
      const stats = calculateStudentStats(st);
      return stats.percentage >= 90;
    });

    const highCount = document.getElementById('highAchieversCountTag');
    if (highCount) highCount.textContent = highAchievers.length;

    const highList = document.getElementById('highAchieversStudentList');
    if (highList) {
      highList.innerHTML = '';
      highAchievers.forEach(st => {
        const stats = calculateStudentStats(st);
        const chip = document.createElement('div');
        chip.className = 'student-chip';
        chip.innerHTML = `<i class="fa-solid fa-crown text-warning"></i> <strong>${st.name}</strong> (${st.rollNo}) - ${stats.percentage}%`;
        chip.onclick = () => openStudentDetailsModal(st.id);
        highList.appendChild(chip);
      });
    }

    // Populate Advisor Student Dropdown
    const advisorSelect = document.getElementById('advisorStudentSelect');
    if (advisorSelect) {
      const currentAdvisorVal = advisorSelect.value;
      advisorSelect.innerHTML = '';
      students.forEach(st => {
        const opt = document.createElement('option');
        opt.value = st.id;
        opt.textContent = `${st.name} (${st.rollNo})`;
        advisorSelect.appendChild(opt);
      });
      if (currentAdvisorVal && advisorSelect.querySelector(`option[value="${currentAdvisorVal}"]`)) {
        advisorSelect.value = currentAdvisorVal;
      }
    }

    renderStudentAdvisor();
  }

  /**
   * Render Personalized Student Diagnostic Advisor
   */
  function renderStudentAdvisor() {
    const select = document.getElementById('advisorStudentSelect');
    const container = document.getElementById('advisorResultContainer');
    if (!select || !container || students.length === 0) return;

    const studentId = select.value || students[0].id;
    const student = students.find(s => s.id === studentId) || students[0];
    const stats = calculateStudentStats(student);

    // Analyze subjects: find best and worst
    const subjectEntries = SUBJECTS.map(sub => ({
      key: sub,
      label: SUBJECT_LABELS[sub],
      mark: Number(student.marks[sub] || 0)
    })).sort((a, b) => b.mark - a.mark);

    const strongestSubject = subjectEntries[0];
    const weakestSubject = subjectEntries[subjectEntries.length - 1];

    // Determine next grade gap
    let gradeTarget = 90;
    let nextGradeName = 'A+';
    if (stats.percentage >= 90) {
      gradeTarget = 100;
      nextGradeName = 'Centum Perfection';
    } else if (stats.percentage >= 80) {
      gradeTarget = 90;
      nextGradeName = 'A+';
    } else if (stats.percentage >= 75) {
      gradeTarget = 80;
      nextGradeName = 'A';
    } else if (stats.percentage >= 65) {
      gradeTarget = 75;
      nextGradeName = 'B+';
    } else if (stats.percentage >= 50) {
      gradeTarget = 65;
      nextGradeName = 'B';
    } else {
      gradeTarget = 50;
      nextGradeName = 'Pass (C)';
    }

    const marksNeeded = Math.max(0, Math.round((gradeTarget * 5) - stats.totalMarks));

    container.innerHTML = `
      <div class="advisor-grid">
        <div class="advisor-student-summary">
          <div class="table-student-name" style="margin-bottom: 0.75rem;">
            <div class="avatar-circle large">${student.name.charAt(0)}</div>
            <div>
              <h4 style="font-size: 1.15rem; font-weight: 800;">${student.name}</h4>
              <p class="text-muted small">Roll: ${student.rollNo} | ${student.department}</p>
            </div>
          </div>
          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 0.75rem 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>Current Total:</span>
            <strong>${stats.totalMarks} / 500 (${stats.percentage}%)</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>Current Grade:</span>
            <span class="grade-badge" style="font-size: 1.05rem;">${stats.grade}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Attendance Rate:</span>
            <strong class="${student.attendance >= 75 ? 'text-success' : 'text-danger'}">${student.attendance}%</strong>
          </div>
        </div>

        <div class="advisor-cards-stack">
          <div class="advisor-item-box success">
            <i class="fa-solid fa-circle-check text-success"></i>
            <div>
              <strong>Strongest Academic Discipline:</strong>
              <p class="small text-muted">
                Performing exceptionally in <strong>${strongestSubject.label}</strong> with <strong>${strongestSubject.mark}/100</strong>. Capable of mentoring peers in this domain.
              </p>
            </div>
          </div>

          <div class="advisor-item-box warning">
            <i class="fa-solid fa-triangle-exclamation text-warning"></i>
            <div>
              <strong>Primary Area for Improvement:</strong>
              <p class="small text-muted">
                Lowest score recorded in <strong>${weakestSubject.label}</strong> with <strong>${weakestSubject.mark}/100</strong>. Dedicate at least 45 minutes of daily practice to this subject.
              </p>
            </div>
          </div>

          <div class="advisor-item-box ${student.attendance >= 75 ? 'success' : 'danger'}">
            <i class="fa-solid ${student.attendance >= 75 ? 'fa-shield-halved text-success' : 'fa-radiation text-danger'}"></i>
            <div>
              <strong>Attendance & Eligibility Evaluation:</strong>
              <p class="small text-muted">
                ${student.attendance >= 75
                  ? `Attendance is within safe university bounds (${student.attendance}%). Fully eligible for semester exams.`
                  : `CRITICAL: Attendance is at ${student.attendance}% (below 75%). Needs to attend next 6 consecutive classes to restore eligibility.`}
              </p>
            </div>
          </div>

          <div class="advisor-item-box" style="border-left-color: var(--primary);">
            <i class="fa-solid fa-bullseye text-primary"></i>
            <div>
              <strong>Next Grade Milestone (${nextGradeName}):</strong>
              <p class="small text-muted">
                Needs <strong>${marksNeeded} marks</strong> across remaining evaluations to achieve Grade ${nextGradeName}.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * ===================================================================
   * 5. GOAL TRACKER VIEW CONTROLLER
   * ===================================================================
   */
  function renderGoalTrackerView() {
    const select = document.getElementById('goalTrackerStudentSelect');
    if (!select || students.length === 0) return;

    if (select.children.length === 0) {
      students.forEach(st => {
        const opt = document.createElement('option');
        opt.value = st.id;
        opt.textContent = `${st.name} (${st.rollNo})`;
        select.appendChild(opt);
      });
    }

    const selectedId = select.value || students[0].id;
    const student = students.find(s => s.id === selectedId) || students[0];
    const stats = calculateStudentStats(student);

    const storedGoals = getStoredGoals();
    const targetMarks = storedGoals[student.id] || 450;

    // Left pane details
    document.getElementById('goalViewStudentName').textContent = student.name;
    document.getElementById('goalViewStudentMeta').textContent = `Roll No: ${student.rollNo} | ${student.department} | Sem ${student.semester}`;
    document.getElementById('goalTargetInput').value = targetMarks;

    document.getElementById('goalCurrentMarks').textContent = stats.totalMarks;
    document.getElementById('goalCurrentPercent').textContent = `${stats.percentage}%`;
    document.getElementById('goalTargetMarks').textContent = targetMarks;
    document.getElementById('goalTargetPercent').textContent = `${((targetMarks / 500) * 100).toFixed(1)}%`;

    const statusEl = document.getElementById('goalStatusText');
    const statusSubEl = document.getElementById('goalStatusSub');
    const diff = targetMarks - stats.totalMarks;

    if (diff <= 0) {
      statusEl.textContent = 'Achieved!';
      statusEl.className = 'box-val text-success';
      statusSubEl.textContent = `+${Math.abs(diff)} marks surplus`;
    } else {
      statusEl.textContent = 'In Progress';
      statusEl.className = 'box-val text-primary';
      statusSubEl.textContent = `${diff} marks to go`;
    }

    // Right pane progress
    const pctAchieved = Math.min(100, Math.round((stats.totalMarks / targetMarks) * 100));
    const fill = document.getElementById('goalLargeProgressFill');
    if (fill) fill.style.width = `${pctAchieved}%`;

    document.getElementById('goalProgressFractionDetailed').textContent = `${stats.totalMarks} of ${targetMarks} marks target`;
    document.getElementById('goalProgressPercentageDetailed').textContent = `${pctAchieved}% Completed`;

    // Milestones Checklist
    const milestonesList = document.getElementById('goalMilestonesList');
    if (milestonesList) {
      milestonesList.innerHTML = `
        <li>
          <i class="fa-solid ${stats.percentage >= 60 ? 'fa-circle-check completed' : 'fa-circle pending'}"></i>
          <span>Clear Minimum Pass Aggregate (300 / 500)</span>
        </li>
        <li>
          <i class="fa-solid ${student.attendance >= 85 ? 'fa-circle-check completed' : 'fa-circle pending'}"></i>
          <span>Maintain Consistent Attendance &gt;= 85% (Current: ${student.attendance}%)</span>
        </li>
        <li>
          <i class="fa-solid ${stats.totalMarks >= targetMarks * 0.8 ? 'fa-circle-check completed' : 'fa-circle pending'}"></i>
          <span>Reach 80% Benchmark of Target Goal (${Math.round(targetMarks * 0.8)} marks)</span>
        </li>
        <li>
          <i class="fa-solid ${diff <= 0 ? 'fa-circle-check completed' : 'fa-circle pending'}"></i>
          <span>Final Milestone: Full Target Achievement (${targetMarks} Marks)</span>
        </li>
      `;
    }
  }

  function setGoalPreset(value) {
    document.getElementById('goalTargetInput').value = value;
    saveCurrentStudentGoal();
  }

  function saveCurrentStudentGoal() {
    const select = document.getElementById('goalTrackerStudentSelect');
    const targetInput = document.getElementById('goalTargetInput');
    if (!select || !targetInput) return;

    const studentId = select.value;
    const targetMarks = Number(targetInput.value);

    if (isNaN(targetMarks) || targetMarks < 100 || targetMarks > 500) {
      showToast('Target marks must be between 100 and 500', 'warning');
      return;
    }

    const storedGoals = getStoredGoals();
    storedGoals[studentId] = targetMarks;
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(storedGoals));

    showToast('Academic goal updated and saved successfully!', 'success');
    renderGoalTrackerView();
  }

  function updateGoal() {
    const input = document.getElementById('dashTargetMarksInput');
    if (!input) return;

    const target = Number(input.value);
    if (isNaN(target) || target < 100 || target > 500) {
      showToast('Target marks must be between 100 and 500', 'warning');
      return;
    }

    const storedGoals = getStoredGoals();
    storedGoals.benchmarkTarget = target;
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(storedGoals));

    showToast(`Benchmark goal updated to ${target} marks`, 'success');
    renderDashboardGoalTrackerWidget();
  }

  function getStoredGoals() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GOALS);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  }

  /**
   * ===================================================================
   * 6. TOP PERFORMERS VIEW (HALL OF FAME & PODIUM)
   * ===================================================================
   */
  function renderTopPerformers() {
    if (!students || students.length === 0) return;

    // Sort students by total percentage descending
    const sorted = [...students].sort((a, b) => {
      const pA = calculateStudentStats(a).percentage;
      const pB = calculateStudentStats(b).percentage;
      return pB - pA;
    });

    // Populate Top 3 Podium
    // Rank 1: Gold
    if (sorted[0]) {
      const s1 = sorted[0];
      const stats1 = calculateStudentStats(s1);
      document.getElementById('rank1Name').textContent = s1.name;
      document.getElementById('rank1Roll').textContent = s1.rollNo;
      document.getElementById('rank1Score').textContent = `${stats1.totalMarks} / 500`;
      document.getElementById('rank1Percent').textContent = `${stats1.percentage}%`;
    }

    // Rank 2: Silver
    if (sorted[1]) {
      const s2 = sorted[1];
      const stats2 = calculateStudentStats(s2);
      document.getElementById('rank2Name').textContent = s2.name;
      document.getElementById('rank2Roll').textContent = s2.rollNo;
      document.getElementById('rank2Score').textContent = `${stats2.totalMarks} / 500`;
      document.getElementById('rank2Percent').textContent = `${stats2.percentage}%`;
    }

    // Rank 3: Bronze
    if (sorted[2]) {
      const s3 = sorted[2];
      const stats3 = calculateStudentStats(s3);
      document.getElementById('rank3Name').textContent = s3.name;
      document.getElementById('rank3Roll').textContent = s3.rollNo;
      document.getElementById('rank3Score').textContent = `${stats3.totalMarks} / 500`;
      document.getElementById('rank3Percent').textContent = `${stats3.percentage}%`;
    }

    // Populate Top 10 Table
    const tbody = document.getElementById('topTenTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const topTen = sorted.slice(0, 10);

    topTen.forEach((st, idx) => {
      const stats = calculateStudentStats(st);
      const tr = document.createElement('tr');

      let rankBadge = `<span class="badge badge-subtle">#${idx + 1}</span>`;
      if (idx === 0) rankBadge = `<span class="badge badge-warning"><i class="fa-solid fa-crown"></i> Rank 1</span>`;
      else if (idx === 1) rankBadge = `<span class="badge badge-subtle" style="background:#e2e8f0;"><i class="fa-solid fa-medal"></i> Rank 2</span>`;
      else if (idx === 2) rankBadge = `<span class="badge badge-subtle" style="background:#ffedd5; color:#c2410c;"><i class="fa-solid fa-medal"></i> Rank 3</span>`;

      tr.innerHTML = `
        <td>${rankBadge}</td>
        <td><strong>${st.name}</strong></td>
        <td>${st.rollNo}</td>
        <td>${st.department}</td>
        <td>${st.marks.mathematics}</td>
        <td>${st.marks.physics}</td>
        <td>${st.marks.chemistry}</td>
        <td>${st.marks.programming}</td>
        <td>${st.marks.english}</td>
        <td><strong>${stats.totalMarks}</strong></td>
        <td><strong class="text-primary">${stats.percentage}%</strong></td>
        <td>
          <button class="btn-cert" onclick="app.openCertificateModal(${idx})">
            <i class="fa-solid fa-certificate text-warning"></i> Certificate
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  /**
   * Open Merit Certificate Modal for a specific rank
   */
  function openCertificateModal(rankIndex) {
    const sorted = [...students].sort((a, b) => {
      return calculateStudentStats(b).percentage - calculateStudentStats(a).percentage;
    });

    const student = sorted[rankIndex] || sorted[0];
    if (!student) return;

    const stats = calculateStudentStats(student);
    const settings = getStoredSettings();

    document.getElementById('certInstituteName').textContent = settings.collegeName;
    document.getElementById('certDeptName').textContent = settings.department;
    document.getElementById('certStudentName').textContent = student.name;
    document.getElementById('certRollNo').textContent = student.rollNo;
    document.getElementById('certRank').textContent = `Rank #${rankIndex + 1}`;
    document.getElementById('certTotalMarks').textContent = `${stats.totalMarks}/500`;
    document.getElementById('certPercentage').textContent = `${stats.percentage}%`;
    document.getElementById('certGrade').textContent = stats.grade;

    document.getElementById('certificateModal').classList.add('show');
  }

  function closeCertificateModal() {
    document.getElementById('certificateModal').classList.remove('show');
  }

  /**
   * ===================================================================
   * 7. ATTENDANCE MANAGEMENT CONTROLLER
   * ===================================================================
   */
  function renderAttendanceView() {
    const metrics = getCohortMetrics();

    // Summary cards
    const avgRate = document.getElementById('attAvgRate');
    if (avgRate) avgRate.textContent = `${metrics.averageAttendance}%`;

    const eligibleCount = students.filter(s => s.attendance >= 75).length;
    const shortageCount = students.filter(s => s.attendance < 75).length;

    const eligibleEl = document.getElementById('attEligibleCount');
    if (eligibleEl) eligibleEl.textContent = eligibleCount;

    const shortageEl = document.getElementById('attShortageCount');
    if (shortageEl) shortageEl.textContent = shortageCount;

    filterAttendanceTable();
  }

  function filterAttendanceTable() {
    const tbody = document.getElementById('attendanceTableBody');
    if (!tbody) return;

    const search = (document.getElementById('attendanceSearchInput')?.value || '').toLowerCase().trim();
    const filtered = students.filter(st => {
      return !search || st.name.toLowerCase().includes(search) || st.rollNo.toLowerCase().includes(search);
    });

    tbody.innerHTML = '';

    filtered.forEach(st => {
      const isEligible = st.attendance >= 75;
      const attendedClasses = Math.round((st.attendance / 100) * 90);
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td><strong>${st.rollNo}</strong></td>
        <td>
          <div class="table-student-name">
            <div class="student-row-avatar">${st.name.charAt(0)}</div>
            <span>${st.name}</span>
          </div>
        </td>
        <td>${st.department}</td>
        <td>${attendedClasses} / 90 Days</td>
        <td>
          <strong class="${isEligible ? 'text-success' : 'text-danger'}">${st.attendance}%</strong>
        </td>
        <td>
          <span class="badge ${isEligible ? 'badge-success' : 'badge-danger'}">
            ${isEligible ? '<i class="fa-solid fa-circle-check"></i> Eligible' : '<i class="fa-solid fa-triangle-exclamation"></i> Shortage Alert'}
          </span>
        </td>
        <td>
          <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.78rem;" onclick="app.toggleTodayAttendance('${st.id}')">
            <i class="fa-solid fa-user-check text-success"></i> Mark Present (+1%)
          </button>
        </td>
        <td>
          <button class="btn-icon-action" title="View Profile" onclick="app.openStudentDetailsModal('${st.id}')">
            <i class="fa-solid fa-eye"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function toggleTodayAttendance(studentId) {
    const st = students.find(s => s.id === studentId);
    if (!st) return;

    st.attendance = Math.min(100, st.attendance + 1);
    saveStudents();
    renderAll();
    showToast(`Attendance updated for ${st.name}: ${st.attendance}%`, 'success');
  }

  function markAllAttendance(isPresent) {
    students.forEach(st => {
      if (isPresent) {
        st.attendance = Math.min(100, st.attendance + 1);
      }
    });
    saveStudents();
    renderAll();
    showToast(`Marked today's attendance for all ${students.length} students.`, 'success');
  }

  function filterLowAttendance() {
    const searchInput = document.getElementById('attendanceSearchInput');
    // Toggle filter: show only students with attendance < 75%
    const tbody = document.getElementById('attendanceTableBody');
    if (!tbody) return;

    const shortages = students.filter(st => st.attendance < 75);
    tbody.innerHTML = '';

    if (shortages.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center" style="padding: 2rem;">No students are in attendance shortage.</td></tr>`;
      return;
    }

    shortages.forEach(st => {
      const attendedClasses = Math.round((st.attendance / 100) * 90);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${st.rollNo}</strong></td>
        <td>
          <div class="table-student-name">
            <div class="student-row-avatar">${st.name.charAt(0)}</div>
            <span>${st.name}</span>
          </div>
        </td>
        <td>${st.department}</td>
        <td>${attendedClasses} / 90 Days</td>
        <td><strong class="text-danger">${st.attendance}%</strong></td>
        <td><span class="badge badge-danger"><i class="fa-solid fa-triangle-exclamation"></i> Shortage Alert</span></td>
        <td>
          <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.78rem;" onclick="app.toggleTodayAttendance('${st.id}')">
            <i class="fa-solid fa-user-check text-success"></i> Mark Present
          </button>
        </td>
        <td>
          <button class="btn-icon-action" onclick="app.openStudentDetailsModal('${st.id}')"><i class="fa-solid fa-eye"></i></button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    showToast(`Displaying ${shortages.length} students with attendance shortage (<75%)`, 'warning');
  }

  /**
   * ===================================================================
   * 8. STUDENT DETAILS PROFILE MODAL (FEATURE 4)
   * ===================================================================
   */
  function openStudentDetailsModal(studentId) {
    const st = students.find(s => s.id === studentId);
    if (!st) return;

    const stats = calculateStudentStats(st);

    document.getElementById('detailAvatar').textContent = st.name.charAt(0);
    document.getElementById('detailName').textContent = st.name;
    document.getElementById('detailRollDept').textContent = `Roll No: ${st.rollNo} | ${st.department} | Semester ${st.semester}`;

    document.getElementById('detailTotalMarks').textContent = `${stats.totalMarks} / 500`;
    document.getElementById('detailPercentage').textContent = `${stats.percentage}%`;
    document.getElementById('detailGrade').textContent = stats.grade;

    const statusBadge = document.getElementById('detailStatusBadge');
    statusBadge.textContent = stats.status;
    statusBadge.className = `badge status-badge ${stats.status.toLowerCase().replace(/\s+/g, '-')}`;

    document.getElementById('detailAttendance').textContent = `${st.attendance}%`;

    // Subject breakdown bars
    const barsContainer = document.getElementById('detailSubjectBars');
    barsContainer.innerHTML = '';

    const subjectList = SUBJECTS.map(sub => ({
      key: sub,
      label: SUBJECT_LABELS[sub],
      mark: Number(st.marks[sub] || 0)
    }));

    subjectList.forEach(sub => {
      const item = document.createElement('div');
      item.className = 'subject-bar-item';
      item.innerHTML = `
        <div class="sub-meta">
          <span>${sub.label}</span>
          <span><strong>${sub.mark}</strong> / 100</span>
        </div>
        <div class="sub-progress-track">
          <div class="sub-progress-bar" style="width: ${sub.mark}%;"></div>
        </div>
      `;
      barsContainer.appendChild(item);
    });

    // Strengths and Weaknesses
    const sortedSubs = [...subjectList].sort((a, b) => b.mark - a.mark);
    const strengths = sortedSubs.slice(0, 2);
    const weaknesses = sortedSubs.slice(-2).reverse();

    const strList = document.getElementById('detailStrengthsList');
    strList.innerHTML = strengths.map(s => `<li>Strong foundation in <strong>${s.label}</strong> (${s.mark}/100)</li>`).join('');

    const wknList = document.getElementById('detailWeaknessesList');
    wknList.innerHTML = weaknesses.map(w => `<li>Target for revision: <strong>${w.label}</strong> (${w.mark}/100)</li>`).join('');

    // Advisor personalized text
    const adviceEl = document.getElementById('detailAdvisorAdvice');
    if (stats.percentage >= 90) {
      adviceEl.textContent = `${st.name} exhibits superior grasp over IT fundamentals. Advised to participate in national hackathons and publish technical literature.`;
    } else if (stats.percentage >= 75) {
      adviceEl.textContent = `${st.name} maintains consistent performance. Prioritizing revision in ${weaknesses[0].label} will comfortably elevate the student to Grade A+.`;
    } else if (stats.percentage >= 60) {
      adviceEl.textContent = `${st.name} requires structured problem practice in ${weaknesses[0].label} and ${weaknesses[1].label} to improve core understanding.`;
    } else {
      adviceEl.textContent = `Immediate academic intervention needed for ${st.name}. Regular tutoring in ${weaknesses[0].label} and remedial assessments strongly urged.`;
    }

    // Connect Edit Button
    const editBtn = document.getElementById('detailEditBtn');
    editBtn.onclick = () => {
      closeStudentDetailsModal();
      openEditStudentModal(st.id);
    };

    document.getElementById('studentDetailsModal').classList.add('show');
  }

  function closeStudentDetailsModal() {
    document.getElementById('studentDetailsModal').classList.remove('show');
  }

  /**
   * ===================================================================
   * 9. SETTINGS & DATA MANAGEMENT
   * ===================================================================
   */
  function loadSettings() {
    const settings = getStoredSettings();
    const collegeEl = document.getElementById('settingCollegeName');
    if (collegeEl) collegeEl.value = settings.collegeName;
    const deptEl = document.getElementById('settingDepartment');
    if (deptEl) deptEl.value = settings.department;
    const yearEl = document.getElementById('settingAcademicYear');
    if (yearEl) yearEl.value = settings.academicYear;
    const semEl = document.getElementById('settingSemester');
    if (semEl) semEl.value = settings.semester;
  }

  function getStoredSettings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  }

  function saveInstituteSettings() {
    const settings = {
      collegeName: document.getElementById('settingCollegeName').value.trim(),
      department: document.getElementById('settingDepartment').value.trim(),
      academicYear: document.getElementById('settingAcademicYear').value.trim(),
      semester: document.getElementById('settingSemester').value.trim()
    };

    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    showToast('Institute academic settings saved successfully!', 'success');
  }

  /**
   * Reset sample dataset
   */
  function resetSampleData() {
    openConfirmModal(
      'Reset Sample Data',
      'Are you sure you want to reset the database? This will restore the original 25 sample student records and overwrite current changes.',
      () => {
        students = JSON.parse(JSON.stringify(DEFAULT_STUDENTS));
        saveStudents();
        renderAll();
        showToast('Sample dataset restored successfully (25 students)', 'success');
      }
    );
  }

  /**
   * Clear all records
   */
  function confirmClearAllData() {
    openConfirmModal(
      'Purge All Student Records',
      'This will delete ALL student records from browser local storage! This action cannot be undone.',
      () => {
        students = [];
        saveStudents();
        renderAll();
        showToast('All student records have been deleted.', 'danger');
      }
    );
  }

  /**
   * Export to CSV
   */
  function exportCSV() {
    if (!students || students.length === 0) {
      showToast('No student records available to export', 'warning');
      return;
    }

    const headers = [
      'Roll Number',
      'Student Name',
      'Department',
      'Semester',
      'Mathematics',
      'Physics',
      'Chemistry',
      'Programming',
      'English',
      'Total Marks (out of 500)',
      'Percentage (%)',
      'Grade',
      'Performance Status',
      'Attendance (%)'
    ];

    const rows = students.map(st => {
      const stats = calculateStudentStats(st);
      return [
        `"${st.rollNo}"`,
        `"${st.name}"`,
        `"${st.department}"`,
        `"${st.semester}"`,
        st.marks.mathematics,
        st.marks.physics,
        st.marks.chemistry,
        st.marks.programming,
        st.marks.english,
        stats.totalMarks,
        stats.percentage,
        `"${stats.grade}"`,
        `"${stats.status}"`,
        st.attendance
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Smart_Student_Performance_Records_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Exported student dataset to CSV file.', 'success');
  }

  /**
   * Export to JSON
   */
  function exportJSON() {
    const dataStr = JSON.stringify(students, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Student_Performance_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Student dataset exported to JSON file.', 'success');
  }

  /**
   * Import JSON Backup
   */
  function handleImportJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported) && imported.length > 0 && imported[0].rollNo && imported[0].marks) {
          students = imported;
          saveStudents();
          renderAll();
          showToast(`Successfully imported ${imported.length} student records!`, 'success');
        } else {
          showToast('Invalid backup format. Expected student records array.', 'danger');
        }
      } catch (err) {
        showToast('Error reading or parsing JSON file', 'danger');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  /**
   * ===================================================================
   * CSV IMPORT & VALIDATION ENGINE
   * ===================================================================
   */
  let parsedCSVRaw = null;
  let validatedCSVRows = [];
  let currentPreviewFilter = 'all';

  /**
   * Open CSV Import Modal
   */
  function openImportCSVModal() {
    parsedCSVRaw = null;
    validatedCSVRows = [];
    currentPreviewFilter = 'all';

    const fileInput = document.getElementById('csvFileInput');
    if (fileInput) fileInput.value = '';

    const dropzone = document.getElementById('csvDropzone');
    if (dropzone) dropzone.style.display = 'block';

    const optionsBar = document.getElementById('importOptionsBar');
    if (optionsBar) optionsBar.style.display = 'none';

    const summary = document.getElementById('csvValidationSummary');
    if (summary) summary.style.display = 'none';

    const alertBox = document.getElementById('csvErrorAlertBox');
    if (alertBox) alertBox.style.display = 'none';

    const previewCard = document.getElementById('csvPreviewCard');
    if (previewCard) previewCard.style.display = 'none';

    const changeBtn = document.getElementById('btnChangeCSVFile');
    if (changeBtn) changeBtn.style.display = 'none';

    const execBtn = document.getElementById('btnExecuteCSVImport');
    if (execBtn) {
      execBtn.disabled = true;
      execBtn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> Confirm & Import Records`;
    }

    document.getElementById('importCSVModal')?.classList.add('show');
  }

  /**
   * Close CSV Import Modal
   */
  function closeImportCSVModal() {
    document.getElementById('importCSVModal')?.classList.remove('show');
    parsedCSVRaw = null;
    validatedCSVRows = [];
  }

  /**
   * Download Sample CSV Template
   */
  function downloadSampleCSV() {
    const headers = 'Roll Number,Student Name,Department,Semester,Mathematics,Physics,Chemistry,Programming,English,Attendance';
    const sampleRows = [
      'IT030,Ankit Saxena,Information Technology,5,88,84,79,92,85,94',
      'IT031,Bhavna Mehra,Computer Science,5,91,89,86,95,90,96',
      'IT032,Chirag Gupta,Electronics & Comm,5,74,70,68,78,75,82',
      'IT033,Divyanshi Sen,Information Technology,5,62,58,54,65,60,70',
      'IT034,Eshan Trivedi,Information Technology,5,96,94,92,98,95,98'
    ];

    const csvContent = '\uFEFF' + [headers, ...sampleRows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Student_Performance_Sample_Template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Downloaded sample CSV template.', 'info');
  }

  /**
   * Parse Raw CSV Text into array of string arrays
   */
  function parseCSVText(text) {
    if (text.charCodeAt(0) === 0xFEFF) {
      text = text.slice(1);
    }
    const lines = [];
    let row = [];
    let inQuotes = false;
    let currentToken = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentToken += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(currentToken.trim());
        currentToken = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') i++;
        row.push(currentToken.trim());
        currentToken = '';
        if (row.some(cell => cell !== '')) {
          lines.push(row);
        }
        row = [];
      } else {
        currentToken += char;
      }
    }
    if (currentToken !== '' || row.length > 0) {
      row.push(currentToken.trim());
      if (row.some(cell => cell !== '')) {
        lines.push(row);
      }
    }
    return lines;
  }

  /**
   * Handle CSV File Selected
   */
  function handleCSVFileSelect(event) {
    const file = event.target?.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      showToast('Please select a valid .CSV file', 'danger');
      return;
    }

    const nameEl = document.getElementById('csvLoadedFileName');
    if (nameEl) nameEl.textContent = file.name;

    const sizeEl = document.getElementById('csvLoadedFileSize');
    if (sizeEl) sizeEl.textContent = `${(file.size / 1024).toFixed(1)} KB`;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        parsedCSVRaw = parseCSVText(text);

        if (!parsedCSVRaw || parsedCSVRaw.length < 2) {
          showToast('The CSV file appears to be empty or missing data rows.', 'danger');
          return;
        }

        // Show options and preview sections
        document.getElementById('csvDropzone').style.display = 'none';
        document.getElementById('importOptionsBar').style.display = 'flex';
        document.getElementById('csvValidationSummary').style.display = 'grid';
        document.getElementById('csvPreviewCard').style.display = 'block';
        document.getElementById('btnChangeCSVFile').style.display = 'inline-flex';

        revalidateCSVPreview();
      } catch (err) {
        console.error('Error processing CSV:', err);
        showToast('Error reading or parsing the CSV file.', 'danger');
      }
    };
    reader.readAsText(file);
  }

  /**
   * Revalidate CSV data according to current import strategy (Add vs Replace)
   */
  function revalidateCSVPreview() {
    if (!parsedCSVRaw || parsedCSVRaw.length < 2) return;

    const strategy = document.querySelector('input[name="importStrategy"]:checked')?.value || 'add';
    const headerRow = parsedCSVRaw[0].map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));

    // Map column indices flexibly
    const colMap = {
      roll: headerRow.findIndex(h => h.includes('roll')),
      name: headerRow.findIndex(h => h.includes('name') || h.includes('student')),
      department: headerRow.findIndex(h => h.includes('dept') || h.includes('department')),
      semester: headerRow.findIndex(h => h.includes('sem')),
      math: headerRow.findIndex(h => h.includes('math')),
      physics: headerRow.findIndex(h => h.includes('phys')),
      chemistry: headerRow.findIndex(h => h.includes('chem')),
      programming: headerRow.findIndex(h => h.includes('prog') || h.includes('cs') || h.includes('code')),
      english: headerRow.findIndex(h => h.includes('eng')),
      attendance: headerRow.findIndex(h => h.includes('attend'))
    };

    // Check required columns
    const missingCols = [];
    if (colMap.roll === -1) missingCols.push('Roll Number');
    if (colMap.name === -1) missingCols.push('Student Name');
    if (colMap.math === -1) missingCols.push('Mathematics');
    if (colMap.physics === -1) missingCols.push('Physics');
    if (colMap.chemistry === -1) missingCols.push('Chemistry');
    if (colMap.programming === -1) missingCols.push('Programming');
    if (colMap.english === -1) missingCols.push('English');
    if (colMap.attendance === -1) missingCols.push('Attendance');

    const alertBox = document.getElementById('csvErrorAlertBox');
    const errorList = document.getElementById('csvErrorList');
    const execBtn = document.getElementById('btnExecuteCSVImport');

    if (missingCols.length > 0) {
      alertBox.style.display = 'flex';
      errorList.innerHTML = `<li><strong>Missing Required Column(s):</strong> ${missingCols.join(', ')}. Please check your CSV column header names.</li>`;
      execBtn.disabled = true;
      document.getElementById('csvPreviewTableBody').innerHTML = `<tr><td colspan="14" class="text-center text-danger" style="padding: 2rem;">Required column headers missing: ${missingCols.join(', ')}</td></tr>`;
      return;
    }

    const existingRolls = (strategy === 'add')
      ? new Set(students.map(s => s.rollNo.toUpperCase().trim()))
      : new Set();

    const seenInCSV = new Set();
    let duplicateRollCount = 0;
    validatedCSVRows = [];

    // Parse each data row
    for (let i = 1; i < parsedCSVRaw.length; i++) {
      const rawRow = parsedCSVRaw[i];
      const rowNum = i;

      const roll = (rawRow[colMap.roll] || '').trim().toUpperCase();
      const name = (rawRow[colMap.name] || '').trim();
      const dept = colMap.department !== -1 && rawRow[colMap.department] ? rawRow[colMap.department].trim() : 'Information Technology';
      const sem = colMap.semester !== -1 && rawRow[colMap.semester] ? rawRow[colMap.semester].trim() : '5';

      const math = Number(rawRow[colMap.math]);
      const phys = Number(rawRow[colMap.physics]);
      const chem = Number(rawRow[colMap.chemistry]);
      const prog = Number(rawRow[colMap.programming]);
      const eng = Number(rawRow[colMap.english]);
      const att = Number(rawRow[colMap.attendance]);

      const issues = [];

      // Validations
      if (!name) {
        issues.push('Missing Student Name');
      }

      if (!roll) {
        issues.push('Missing Roll Number');
      } else {
        if (seenInCSV.has(roll)) {
          issues.push(`Duplicate roll number "${roll}" inside this CSV`);
          duplicateRollCount++;
        } else {
          seenInCSV.add(roll);
        }

        if (strategy === 'add' && existingRolls.has(roll)) {
          issues.push(`Roll number "${roll}" already exists in dashboard`);
          duplicateRollCount++;
        }
      }

      if (isNaN(att) || att < 0 || att > 100) {
        issues.push(`Attendance (${rawRow[colMap.attendance] || 'empty'}) must be between 0 and 100%`);
      }

      const subjects = [
        { label: 'Math', val: math, raw: rawRow[colMap.math] },
        { label: 'Physics', val: phys, raw: rawRow[colMap.physics] },
        { label: 'Chemistry', val: chem, raw: rawRow[colMap.chemistry] },
        { label: 'Programming', val: prog, raw: rawRow[colMap.programming] },
        { label: 'English', val: eng, raw: rawRow[colMap.english] }
      ];

      subjects.forEach(s => {
        if (isNaN(s.val) || s.val < 0 || s.val > 100) {
          issues.push(`${s.label} score (${s.raw || 'empty'}) must be a number between 0 and 100`);
        }
      });

      const isValid = issues.length === 0;

      // Calculate total, percentage, grade, status
      const calc = calculateMarksHelper(
        isValid ? math : 0,
        isValid ? phys : 0,
        isValid ? chem : 0,
        isValid ? prog : 0,
        isValid ? eng : 0
      );

      validatedCSVRows.push({
        rowNum,
        name: name || 'Unnamed',
        rollNo: roll || `ROW-${rowNum}`,
        department: dept,
        semester: sem,
        attendance: isNaN(att) ? 0 : att,
        marks: {
          mathematics: isNaN(math) ? 0 : math,
          physics: isNaN(phys) ? 0 : phys,
          chemistry: isNaN(chem) ? 0 : chem,
          programming: isNaN(prog) ? 0 : prog,
          english: isNaN(eng) ? 0 : eng
        },
        calculated: calc,
        isValid,
        issues
      });
    }

    const totalCount = validatedCSVRows.length;
    const validCount = validatedCSVRows.filter(r => r.isValid).length;
    const invalidCount = totalCount - validCount;

    // Update chips
    document.getElementById('csvTotalRows').textContent = totalCount;
    document.getElementById('csvValidRows').textContent = validCount;
    document.getElementById('csvInvalidRows').textContent = invalidCount;
    document.getElementById('csvDuplicateRolls').textContent = duplicateRollCount;

    document.getElementById('countAllRows').textContent = totalCount;
    document.getElementById('countValidRows').textContent = validCount;
    document.getElementById('countInvalidRows').textContent = invalidCount;

    // Error alert banner
    if (invalidCount > 0) {
      alertBox.style.display = 'flex';
      const sampleErrors = validatedCSVRows.filter(r => !r.isValid).slice(0, 5);
      errorList.innerHTML = sampleErrors.map(r => `<li><strong>Row ${r.rowNum} (${r.rollNo}):</strong> ${r.issues.join(' • ')}</li>`).join('');
      if (invalidCount > 5) {
        errorList.innerHTML += `<li><em>...and ${invalidCount - 5} more row(s) with issues.</em></li>`;
      }
    } else {
      alertBox.style.display = 'none';
    }

    // Enable / disable button
    if (validCount > 0) {
      execBtn.disabled = false;
      execBtn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> Confirm & Import ${validCount} Records (${strategy === 'replace' ? 'Replace' : 'Add'})`;
    } else {
      execBtn.disabled = true;
      execBtn.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> No Valid Records to Import`;
    }

    renderCSVPreviewTable();
  }

  /**
   * Filter Preview Table Rows
   */
  function filterPreviewTable(filterType) {
    currentPreviewFilter = filterType;
    document.querySelectorAll('.preview-filter-pills .pill-btn').forEach(btn => btn.classList.remove('active'));
    if (filterType === 'all') document.getElementById('pillShowAll')?.classList.add('active');
    else if (filterType === 'valid') document.getElementById('pillShowValid')?.classList.add('active');
    else if (filterType === 'invalid') document.getElementById('pillShowInvalid')?.classList.add('active');

    renderCSVPreviewTable();
  }

  /**
   * Render CSV Preview Table
   */
  function renderCSVPreviewTable() {
    const tbody = document.getElementById('csvPreviewTableBody');
    if (!tbody) return;

    let rowsToRender = validatedCSVRows;
    if (currentPreviewFilter === 'valid') {
      rowsToRender = validatedCSVRows.filter(r => r.isValid);
    } else if (currentPreviewFilter === 'invalid') {
      rowsToRender = validatedCSVRows.filter(r => !r.isValid);
    }

    tbody.innerHTML = '';

    if (rowsToRender.length === 0) {
      tbody.innerHTML = `<tr><td colspan="14" class="text-center text-muted" style="padding: 1.5rem;">No rows match the selected filter.</td></tr>`;
      return;
    }

    rowsToRender.forEach(r => {
      const tr = document.createElement('tr');
      tr.className = r.isValid ? 'preview-row-valid' : 'preview-row-invalid';

      const statusBadge = r.isValid
        ? `<span class="badge badge-success"><i class="fa-solid fa-check"></i> Ready</span>`
        : `<span class="badge badge-danger" title="${r.issues.join(', ')}"><i class="fa-solid fa-xmark"></i> Invalid</span>`;

      tr.innerHTML = `
        <td>${statusBadge}</td>
        <td><strong>${r.rollNo}</strong></td>
        <td>${r.name}</td>
        <td>${r.department} (Sem ${r.semester})</td>
        <td>${r.marks.mathematics}</td>
        <td>${r.marks.physics}</td>
        <td>${r.marks.chemistry}</td>
        <td>${r.marks.programming}</td>
        <td>${r.marks.english}</td>
        <td><strong>${r.attendance}%</strong></td>
        <td><strong>${r.calculated.total}</strong></td>
        <td><strong class="text-primary">${r.calculated.percentage}%</strong></td>
        <td><span class="grade-badge">${r.calculated.grade}</span></td>
        <td>${r.isValid ? '<span class="text-success small">All checks passed</span>' : `<span class="text-danger small">${r.issues.join('; ')}</span>`}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  /**
   * Execute CSV Import
   */
  function executeImportCSV() {
    const validRows = validatedCSVRows.filter(r => r.isValid);
    if (validRows.length === 0) {
      showToast('No valid records available to import.', 'danger');
      return;
    }

    const strategy = document.querySelector('input[name="importStrategy"]:checked')?.value || 'add';

    const newStudents = validRows.map((r, idx) => ({
      id: `stud-csv-${Date.now()}-${idx}`,
      name: r.name,
      rollNo: r.rollNo,
      department: r.department,
      semester: r.semester,
      attendance: r.attendance,
      marks: {
        mathematics: r.marks.mathematics,
        physics: r.marks.physics,
        chemistry: r.marks.chemistry,
        programming: r.marks.programming,
        english: r.marks.english
      }
    }));

    if (strategy === 'replace') {
      students = newStudents;
      showToast(`Database replaced with ${newStudents.length} imported student records!`, 'success');
    } else {
      students = [...newStudents, ...students];
      showToast(`Added ${newStudents.length} new student records to existing dataset!`, 'success');
    }

    saveStudents();
    renderAll();
    closeImportCSVModal();

    // Switch to Student Management view to immediately see results
    switchView('students');
  }

  /**
   * ===================================================================
   * 10. GLOBAL SEARCH & AUTOCOMPLETE
   * ===================================================================
   */
  function setupGlobalSearch() {
    const searchInput = document.getElementById('globalSearchInput');
    const resultsBox = document.getElementById('searchResultsDropdown');
    if (!searchInput || !resultsBox) return;

    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      if (!q) {
        resultsBox.style.display = 'none';
        return;
      }

      const matches = students.filter(s =>
        s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q)
      ).slice(0, 5);

      if (matches.length === 0) {
        resultsBox.innerHTML = `<div style="padding: 1rem; color: #94a3b8; font-size: 0.85rem;">No student matches found.</div>`;
      } else {
        resultsBox.innerHTML = matches.map(s => {
          const stats = calculateStudentStats(s);
          return `
            <div class="search-result-item" onclick="app.selectSearchResult('${s.id}')">
              <div class="table-student-name">
                <div class="student-row-avatar">${s.name.charAt(0)}</div>
                <div>
                  <strong>${s.name}</strong>
                  <div class="small text-muted">${s.rollNo} • ${s.department}</div>
                </div>
              </div>
              <div>
                <span class="badge ${stats.percentage >= 75 ? 'badge-success' : 'badge-primary'}">${stats.percentage}%</span>
              </div>
            </div>
          `;
        }).join('');
      }

      resultsBox.style.display = 'block';
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !resultsBox.contains(e.target)) {
        resultsBox.style.display = 'none';
      }
    });
  }

  function selectSearchResult(studentId) {
    const resultsBox = document.getElementById('searchResultsDropdown');
    const searchInput = document.getElementById('globalSearchInput');
    if (resultsBox) resultsBox.style.display = 'none';
    if (searchInput) searchInput.value = '';
    openStudentDetailsModal(studentId);
  }

  /**
   * ===================================================================
   * 11. NAVIGATION & ROUTING
   * ===================================================================
   */
  function switchView(viewName) {
    // Hide all views
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));

    // Deactivate all sidebar items
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => item.classList.remove('active'));

    // Activate selected view
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
      targetView.classList.add('active');
    }

    // Activate sidebar nav item
    const targetNavItem = document.querySelector(`.sidebar-nav .nav-item[data-view="${viewName}"]`);
    if (targetNavItem) {
      targetNavItem.classList.add('active');
    }

    // Close mobile sidebar if open
    document.getElementById('sidebar')?.classList.remove('open');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger chart update or resize if switching into analytics or dashboard
    if (viewName === 'analytics') {
      setTimeout(() => updateAnalyticsCharts(), 50);
    } else if (viewName === 'dashboard') {
      setTimeout(() => {
        if (charts.subjectWise) charts.subjectWise.resize();
        if (charts.overallDonut) charts.overallDonut.resize();
        if (charts.trend) charts.trend.resize();
      }, 50);
    }
  }

  /**
   * ===================================================================
   * 12. THEME & EVENT LISTENERS
   * ===================================================================
   */
  function loadTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    setTheme(savedTheme);
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);

    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
      btn.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    }

    // Refresh charts with updated theme borders
    if (charts.overallDonut) {
      charts.overallDonut.data.datasets[0].borderColor = theme === 'dark' ? '#111827' : '#ffffff';
      charts.overallDonut.update();
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    showToast(`Switched to ${next} theme`, 'info');
  }

  function updateDateDisplay() {
    const dateEl = document.getElementById('currentDateDisplay');
    if (!dateEl) return;

    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const today = new Date();
    dateEl.textContent = today.toLocaleDateString('en-US', options);
  }

  function setupEventListeners() {
    // Sidebar nav click handlers
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const view = item.getAttribute('data-view');
        if (view) switchView(view);
      });
    });

    // Mobile sidebar toggle
    document.getElementById('menuToggleBtn')?.addEventListener('click', () => {
      document.getElementById('sidebar')?.classList.add('open');
    });

    document.getElementById('sidebarCloseBtn')?.addEventListener('click', () => {
      document.getElementById('sidebar')?.classList.remove('open');
    });

    // Theme toggle button
    document.getElementById('themeToggleBtn')?.addEventListener('click', toggleTheme);

    // Profile dropdown toggle
    document.getElementById('profileDropdownBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('profileDropdown')?.classList.toggle('show');
      document.getElementById('notificationDropdown')?.classList.remove('show');
    });

    // Notification dropdown toggle
    document.getElementById('notificationBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('notificationDropdown')?.classList.toggle('show');
      document.getElementById('profileDropdown')?.classList.remove('show');
    });

    // Close dropdowns on outside click
    document.addEventListener('click', () => {
      document.getElementById('profileDropdown')?.classList.remove('show');
      document.getElementById('notificationDropdown')?.classList.remove('show');
    });

    // Student Search filter in Student Management
    document.getElementById('studentSearchFilter')?.addEventListener('input', () => {
      renderStudentManagement();
    });

    document.getElementById('filterDept')?.addEventListener('change', () => {
      renderStudentManagement();
    });

    document.getElementById('filterGrade')?.addEventListener('change', () => {
      renderStudentManagement();
    });

    document.getElementById('filterStatus')?.addEventListener('change', () => {
      renderStudentManagement();
    });

    // Auto-calculation listeners for Inline Student Form
    ['inlineMath', 'inlinePhysics', 'inlineChemistry', 'inlineProgramming', 'inlineEnglish'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', updateInlineAutoCalc);
    });

    // Auto-calculation listeners for Modal Student Form
    ['formMath', 'formPhysics', 'formChemistry', 'formProgramming', 'formEnglish'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', updateModalAutoCalc);
    });

    // CSV Drag & Drop handlers
    const dropzone = document.getElementById('csvDropzone');
    if (dropzone) {
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
      });
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleCSVFileSelect({ target: { files: e.dataTransfer.files } });
        }
      });
    }
  }

  /**
   * ===================================================================
   * 13. CONFIRMATION & TOAST SYSTEM
   * ===================================================================
   */
  function openConfirmModal(title, message, onConfirm) {
    document.getElementById('confirmModalTitle').textContent = title;
    document.getElementById('confirmModalMessage').innerHTML = message;
    confirmCallback = onConfirm;

    const btn = document.getElementById('confirmModalBtn');
    btn.onclick = () => {
      if (confirmCallback) confirmCallback();
      closeConfirmModal();
    };

    document.getElementById('confirmModal').classList.add('show');
  }

  function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('show');
    confirmCallback = null;
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'fa-circle-info text-primary';
    if (type === 'success') icon = 'fa-circle-check text-success';
    if (type === 'warning') icon = 'fa-triangle-exclamation text-warning';
    if (type === 'danger') icon = 'fa-circle-xmark text-danger';

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span style="font-size: 0.88rem; flex: 1;">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Initialize on DOM load
  document.addEventListener('DOMContentLoaded', init);

  // Expose public API
  return {
    switchView,
    openAddStudentModal,
    openEditStudentModal,
    closeStudentModal,
    saveStudentForm,
    confirmDeleteStudent,
    openStudentDetailsModal,
    closeStudentDetailsModal,
    openCertificateModal,
    closeCertificateModal,
    openConfirmModal,
    closeConfirmModal,
    sortTable,
    resetFilters,
    updateAnalyticsCharts,
    renderStudentAdvisor,
    renderGoalTrackerView,
    setGoalPreset,
    saveCurrentStudentGoal,
    updateGoal,
    filterAttendanceTable,
    toggleTodayAttendance,
    markAllAttendance,
    filterLowAttendance,
    saveInstituteSettings,
    resetSampleData,
    confirmClearAllData,
    exportCSV,
    exportJSON,
    handleImportJSON,
    selectSearchResult,
    showToast,
    // Inline Form & Auto Calc
    saveInlineStudent,
    editStudentInline,
    cancelEditMode,
    resetInlineStudentForm,
    toggleInlineForm,
    confirmDeleteSampleData,
    // CSV Import System
    openImportCSVModal,
    closeImportCSVModal,
    downloadSampleCSV,
    handleCSVFileSelect,
    revalidateCSVPreview,
    filterPreviewTable,
    executeImportCSV
  };
})();
