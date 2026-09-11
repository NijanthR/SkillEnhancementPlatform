const User = require('../models/User');
const SkillGap = require('../models/SkillGap');
const Skill = require('../models/Skill');
const Resource = require('../models/Resource');

const seedInitialData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return; // Data already exists
    }

    console.log('🌱 Database is empty — seeding demo data...');

    // 1. Create Default Skill Gaps
    const defaultGaps = [
      {
        domain: 'Web Development',
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
      },
      {
        domain: 'Data Science & AI',
        requiredSkills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Machine Learning', 'Data Visualization'],
      },
      {
        domain: 'Cloud & DevOps',
        requiredSkills: ['Linux', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Git'],
      },
      {
        domain: 'Mobile App Development',
        requiredSkills: ['Flutter', 'React Native', 'Java', 'Kotlin', 'REST APIs', 'Firebase'],
      }
    ];

    for (const gap of defaultGaps) {
      await SkillGap.create(gap);
    }

    // 2. Create Faculty Account
    const faculty = await User.create({
      name: 'Dr. Alan Turing',
      email: 'faculty@college.edu',
      password: 'password123',
      role: 'faculty',
      department: 'Computer Science & Engineering',
      bio: 'Professor & Department Head, specializing in Full-Stack Systems & AI.',
    });

    // 3. Create Student Accounts
    const student1 = await User.create({
      name: 'Jane Doe',
      email: 'student@college.edu',
      password: 'password123',
      role: 'student',
      department: 'Computer Science & Engineering',
      rollNumber: 'CS2024001',
      bio: 'Enthusiastic full-stack web developer and open-source contributor.',
    });

    const student2 = await User.create({
      name: 'Alex Rivera',
      email: 'alex@college.edu',
      password: 'password123',
      role: 'student',
      department: 'Information Technology',
      rollNumber: 'IT2024002',
      bio: 'Aspiring Cloud & DevOps engineer.',
    });

    // 4. Create Sample Skills for Students
    await Skill.create({
      studentId: student1._id,
      name: 'React',
      category: 'Web Development',
      level: 'Intermediate',
      description: 'Built multiple SPAs using React Hooks, Router, and Context API.',
      status: 'Verified',
      verifiedBy: faculty._id,
      verifiedAt: new Date(),
      feedback: 'Excellent component architecture and clean state management!',
    });

    await Skill.create({
      studentId: student1._id,
      name: 'JavaScript',
      category: 'Programming',
      level: 'Advanced',
      description: 'ES6+, Async/Await, DOM manipulation, Web APIs.',
      status: 'Verified',
      verifiedBy: faculty._id,
      verifiedAt: new Date(),
      feedback: 'Strong grasp of core JavaScript fundamentals.',
    });

    await Skill.create({
      studentId: student1._id,
      name: 'Node.js',
      category: 'Web Development',
      level: 'Intermediate',
      description: 'RESTful API development with Express and MongoDB.',
      status: 'Pending',
    });

    await Skill.create({
      studentId: student2._id,
      name: 'Python',
      category: 'Programming',
      level: 'Advanced',
      description: 'Data scripting, backend services, automation.',
      status: 'Verified',
      verifiedBy: faculty._id,
      verifiedAt: new Date(),
      feedback: 'Good problem solving skills.',
    });

    await Skill.create({
      studentId: student2._id,
      name: 'Docker',
      category: 'DevOps',
      level: 'Beginner',
      description: 'Containerizing Node.js and Python microservices.',
      status: 'Pending',
    });

    // 5. Create Sample Resources
    await Resource.create({
      facultyId: faculty._id,
      title: 'Full Stack React & Node Master Guide',
      description: 'Comprehensive guide covering React 18, Express architecture, and MongoDB best practices.',
      url: 'https://react.dev',
      category: 'Web Development',
      skillTags: ['React', 'Node.js', 'JavaScript'],
    });

    await Resource.create({
      facultyId: faculty._id,
      title: 'Modern Cloud & Docker Essentials',
      description: 'Hands-on guide to containerization and cloud orchestration.',
      url: 'https://docs.docker.com',
      category: 'DevOps',
      skillTags: ['Docker', 'Linux', 'AWS'],
    });

    console.log('✅ Demo data seeded successfully!');
    console.log('   👨‍🏫 Faculty Demo: faculty@college.edu / password123');
    console.log('   👨‍🎓 Student Demo: student@college.edu / password123');
  } catch (err) {
    console.error('⚠️ Seeding error:', err.message);
  }
};

module.exports = { seedInitialData };
