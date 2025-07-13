const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

let students = [
  {
    id: 1,
    name: "Alex Johnson",
    studentId: "CS2021001",
    department: "Computer Science",
    year: "3rd Year",
    cgpa: 8.5,
    eventsJoined: 12,
    eventsWon: 3,
    lastActive: "2 hours ago",
    status: "active",
    email: "alex.johnson@college.edu",
    phone: "+1 234-567-8901",
    profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    joinedEvents: ["Codeforces Round", "ML Workshop"]
  },
  // Add 3 more students (copy from your frontend data)
  {
      id: 2,
      name: "Sarah Williams",
      email: "sarah.williams@college.edu",
      phone: "+1 234-567-8902",
      studentId: "CS2021002",
      department: "Computer Science",
      year: "2nd Year",
      cgpa: 9.1,
      eventsJoined: 8,
      eventsWon: 5,
      lastActive: "1 hour ago",
      profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      status: "active",
      joinedEvents: ["AI Contest", "Hackathon", "Web Dev Workshop"]
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "michael.chen@college.edu",
      phone: "+1 234-567-8903",
      studentId: "EC2021001",
      department: "Electronics",
      year: "4th Year",
      cgpa: 7.8,
      eventsJoined: 15,
      eventsWon: 2,
      lastActive: "30 minutes ago",
      profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      status: "active",
      joinedEvents: ["Robotics Contest", "IoT Workshop"]
    },
    {
      id: 4,
      name: "Emma Davis",
      email: "emma.davis@college.edu",
      phone: "+1 234-567-8904",
      studentId: "ME2021001",
      department: "Mechanical",
      year: "1st Year",
      cgpa: 8.9,
      eventsJoined: 5,
      eventsWon: 1,
      lastActive: "5 minutes ago",
      profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      status: "active",
      joinedEvents: ["Design Contest", "CAD Workshop"]
    }
];

let events = [
  {
    id: 1,
    title: "Machine Learning Workshop",
    date: "2025-07-10",
    time: "2:00 PM",
    duration: "4 hours",
    type: "Workshop",
    status: "live",
    venue: "Lab A-101",
    participants: 89,
    maxParticipants: 100,
    registrations: 95,
    department: "Computer Science"
  },
   
    {
      id: 2,
      title: "Machine Learning Workshop",
      date: "2025-07-10",
      time: "2:00 PM",
      duration: "4 hours",
      type: "Workshop",
      status: "live",
      venue: "Lab A-101",
      participants: 89,
      maxParticipants: 100,
      registrations: 95,
      department: "Computer Science"
    },
    {
      id: 3,
      title: "Robotics Competition",
      date: "2025-07-15",
      time: "10:00 AM",
      duration: "6 hours",
      type: "Competition",
      status: "upcoming",
      venue: "Main Auditorium",
      participants: 45,
      maxParticipants: 60,
      registrations: 52,
      department: "Electronics"
    }
  // Add 2 more events (copy from your frontend data)
];

io.on('connection', (socket) => {
  console.log("🟢 Client connected");

  socket.emit('initialData', { students, events });

  const interval = setInterval(() => {
    events = events.map(e =>
      e.status === 'live'
        ? { ...e, participants: Math.min(e.participants + Math.floor(Math.random() * 3), e.maxParticipants) }
        : e
    );

    students = students.map(s => ({
      ...s,
      lastActive: Math.random() > 0.8 ? "Just now" : s.lastActive
    }));

    socket.emit('updateEvents', events);
    socket.emit('updateStudents', students);
  }, 5000);

  socket.on('disconnect', () => {
    console.log("🔴 Client disconnected");
    clearInterval(interval);
  });
});

server.listen(4000, () => {
  console.log("🚀 Server running at http://localhost:4000");
});
