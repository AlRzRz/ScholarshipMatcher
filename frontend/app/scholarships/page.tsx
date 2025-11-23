'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useStudentProfile } from '../contexts/StudentProfileContext';

interface Scholarship {
  id: string;
  name: string;
  amount: number;
  deadline: string;
  description: string;
  criteria_text: string;
  tags: string[];
}

export default function ScholarshipsPage() {
  const { selectedStudent, setSelectedStudent, students, loading: studentsLoading } = useStudentProfile();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [allScholarships, setAllScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [amountFilter, setAmountFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Try to fetch from API first, fallback to hardcoded data
    fetch('/api/scholarships')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('API not available');
      })
      .then(data => {
        setScholarships(data);
        setAllScholarships(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback: use hardcoded scholarship data
        // In production, replace this with actual API endpoint
        const fallbackData: Scholarship[] = [
          {
            id: "sch_001",
            name: "Excellence in STEM Scholarship",
            amount: 5000,
            deadline: "2025-12-01",
            description: "This scholarship supports high-achieving students pursuing degrees in science, technology, engineering, or mathematics. It emphasizes rigorous academic performance, commitment to STEM research, and demonstrated curiosity in scientific exploration.",
            criteria_text: "Must be an undergraduate or incoming freshman majoring in a STEM discipline. Minimum GPA of 3.5. Applicants must submit a personal essay and one faculty recommendation.",
            tags: ["STEM", "Merit", "Undergraduate"]
          },
          {
            id: "sch_002",
            name: "Community Impact Leaders Award",
            amount: 3000,
            deadline: "2025-10-15",
            description: "Awarded to students who demonstrate exceptional commitment to community service and social impact through sustained volunteer work, advocacy, or community leadership.",
            criteria_text: "Open to all majors. Must provide documentation of at least 100 hours of community service and an essay describing long-term community impact.",
            tags: ["Community Service", "Leadership", "Undergraduate", "Social Impact"]
          },
          {
            id: "sch_003",
            name: "Future Innovators Engineering Grant",
            amount: 8000,
            deadline: "2025-11-20",
            description: "Supports engineering students who have demonstrated hands-on innovation, participation in maker projects, robotics, engineering competitions, or technical invention.",
            criteria_text: "Applicants must submit a portfolio of engineering work, project descriptions, or prototypes. 3.0 GPA minimum.",
            tags: ["Engineering", "Innovation", "Project-Based", "Undergraduate"]
          },
          {
            id: "sch_004",
            name: "Arts & Creative Expression Scholarship",
            amount: 2500,
            deadline: "2025-08-30",
            description: "Designed for students pursuing visual arts, design, performance, or creative writing who exhibit exceptional artistic vision and originality.",
            criteria_text: "Portfolio submission required. Open to both undergraduate and graduate artists in any creative field.",
            tags: ["Arts", "Creative", "Portfolio", "Undergraduate", "Graduate"]
          },
          {
            id: "sch_005",
            name: "First-Generation Student Success Scholarship",
            amount: 4000,
            deadline: "2025-09-10",
            description: "Provides financial support for first-generation college students who demonstrate resilience, academic promise, and commitment to overcoming barriers to education.",
            criteria_text: "Open to first-generation students only. Must submit short personal history essay.",
            tags: ["First-Generation", "Equity", "Undergraduate"]
          },
          {
            id: "sch_006",
            name: "Women in Computing Award",
            amount: 7000,
            deadline: "2025-12-05",
            description: "Recognizes outstanding women pursuing degrees in computer science, cybersecurity, AI, or related computing fields. Focuses on leadership potential in tech.",
            criteria_text: "Must be a woman majoring in computing. Demonstrated interest via projects, internships, or clubs.",
            tags: ["Women in Tech", "Computing", "STEM", "Diversity"]
          },
          {
            id: "sch_007",
            name: "Global Leadership & Cultural Exchange Scholarship",
            amount: 3500,
            deadline: "2025-07-01",
            description: "Supports students who have shown commitment to global citizenship, cross-cultural understanding, language learning, or international exchange.",
            criteria_text: "Essay required describing global or multicultural experiences. Open to all majors.",
            tags: ["Global Studies", "Leadership", "Cultural Exchange"]
          },
          {
            id: "sch_008",
            name: "Environmental Sustainability Fellowship",
            amount: 6000,
            deadline: "2025-11-01",
            description: "Awarded to students pursuing environmental science or sustainability-focused initiatives. Prioritizes applicants with hands-on conservation experience.",
            criteria_text: "Open to students in environmental fields. Project proposal or sustainability initiative required.",
            tags: ["Environment", "Sustainability", "STEM", "Project-Based"]
          },
          {
            id: "sch_009",
            name: "Future Educators Teaching Scholarship",
            amount: 3000,
            deadline: "2025-09-30",
            description: "Supports future K–12 educators dedicated to improving education quality, equity, and student engagement.",
            criteria_text: "Must be majoring in education. Teaching philosophy essay required.",
            tags: ["Education", "Teaching", "Undergraduate"]
          },
          {
            id: "sch_010",
            name: "Entrepreneurial Spirit Innovation Grant",
            amount: 5000,
            deadline: "2025-10-01",
            description: "For students developing entrepreneurial ventures or early-stage startups. Focuses on creativity, business vision, and feasibility.",
            criteria_text: "Business plan or prototype required. Open to any major.",
            tags: ["Entrepreneurship", "Innovation", "Business"]
          },
          {
            id: "sch_011",
            name: "Healthcare Heroes Scholarship",
            amount: 4500,
            deadline: "2025-12-10",
            description: "Supports students entering healthcare professions, emphasizing compassion, patient advocacy, and clinical excellence.",
            criteria_text: "Must be enrolled in a health sciences or pre-med program. Healthcare service experience recommended.",
            tags: ["Healthcare", "Pre-Med", "Nursing"]
          },
          {
            id: "sch_012",
            name: "Cybersecurity Achievement Award",
            amount: 6500,
            deadline: "2025-11-15",
            description: "Recognizes students pursuing cybersecurity fields with strong analytical and defensive security skills.",
            criteria_text: "Applicants must submit a security project, CTF write-up, or research summary.",
            tags: ["Cybersecurity", "STEM", "Computing"]
          },
          {
            id: "sch_013",
            name: "Journalism Integrity & Media Scholarship",
            amount: 2800,
            deadline: "2025-09-12",
            description: "Award for aspiring journalists who demonstrate excellence in storytelling, ethical reporting, or media innovation.",
            criteria_text: "Writing samples required. Open to journalism and communication majors.",
            tags: ["Journalism", "Media", "Writing"]
          },
          {
            id: "sch_014",
            name: "Rural Student Achievement Grant",
            amount: 5000,
            deadline: "2025-08-20",
            description: "Supports high-potential students from rural or underserved areas aiming to pursue higher education.",
            criteria_text: "Must be from a rural community. Essay describing background and goals required.",
            tags: ["Rural", "Equity", "Undergraduate"]
          },
          {
            id: "sch_015",
            name: "Business Leadership Merit Scholarship",
            amount: 4000,
            deadline: "2025-10-18",
            description: "For business majors with a record of leadership, teamwork, and professional ambition.",
            criteria_text: "Resume and leadership essay required. 3.3 GPA minimum.",
            tags: ["Business", "Leadership", "Merit"]
          },
          {
            id: "sch_016",
            name: "Creative Writing Emerging Authors Prize",
            amount: 2000,
            deadline: "2025-07-25",
            description: "Awarded to emerging writers with exceptional skill in fiction, poetry, or narrative nonfiction.",
            criteria_text: "Submit 2–3 writing samples. Open to all majors.",
            tags: ["Writing", "Creative", "Arts"]
          },
          {
            id: "sch_017",
            name: "Public Service & Policy Scholarship",
            amount: 6000,
            deadline: "2025-11-30",
            description: "Supports students pursuing political science, public policy, or social justice work aimed at improving civic life.",
            criteria_text: "Public service experience required. Policy-interest statement recommended.",
            tags: ["Public Policy", "Civic Engagement", "Leadership"]
          },
          {
            id: "sch_018",
            name: "AI & Machine Learning Research Fellowship",
            amount: 9000,
            deadline: "2025-12-20",
            description: "Recognizes students contributing to machine learning research, model development, or AI ethics studies.",
            criteria_text: "Research summary or published work preferred. Open to grad and undergrad.",
            tags: ["AI", "Machine Learning", "Research", "STEM"]
          },
          {
            id: "sch_019",
            name: "LGBTQ+ Student Empowerment Scholarship",
            amount: 3500,
            deadline: "2025-09-05",
            description: "Supports LGBTQ+ students who demonstrate advocacy, leadership, and commitment to equality.",
            criteria_text: "Open to LGBTQ+ identifying students. Advocacy essay required.",
            tags: ["LGBTQ+", "Equity", "Leadership"]
          },
          {
            id: "sch_020",
            name: "Humanities & Social Sciences Research Award",
            amount: 3000,
            deadline: "2025-10-09",
            description: "Supports students conducting significant humanities or social science research projects.",
            criteria_text: "Research proposal required. Faculty recommendation encouraged.",
            tags: ["Humanities", "Research", "Social Sciences"]
          },
          {
            id: "sch_021",
            name: "Future Nurses Compassion Grant",
            amount: 2500,
            deadline: "2025-08-15",
            description: "Award for nursing students demonstrating empathy, patient advocacy, and commitment to healthcare equity.",
            criteria_text: "Must be in a nursing program. Clinical experience strongly valued.",
            tags: ["Nursing", "Healthcare", "Compassion"]
          },
          {
            id: "sch_022",
            name: "Robotics & Automation Innovators Scholarship",
            amount: 7500,
            deadline: "2025-10-28",
            description: "Supports robotics students involved in automation design, AI-driven robotics, or competitive robotics teams.",
            criteria_text: "Project portfolio required. Participation in robotics competitions is a plus.",
            tags: ["Robotics", "Engineering", "STEM"]
          },
          {
            id: "sch_023",
            name: "Diversity in Law & Justice Scholarship",
            amount: 6000,
            deadline: "2025-09-25",
            description: "Promotes diversity in the legal field by supporting underrepresented students pursuing pre-law or legal studies.",
            criteria_text: "Open to underrepresented groups in law. Essay required.",
            tags: ["Law", "Diversity", "Social Justice"]
          },
          {
            id: "sch_024",
            name: "Data Science Impact Award",
            amount: 6500,
            deadline: "2025-11-22",
            description: "For students using data science to solve real-world problems in business, medicine, or social issues.",
            criteria_text: "Data project submission required. Open to all data-oriented majors.",
            tags: ["Data Science", "STEM", "Impact"]
          },
          {
            id: "sch_025",
            name: "Performing Arts Talent Scholarship",
            amount: 3000,
            deadline: "2025-06-30",
            description: "Recognizes gifted performers in music, theater, dance, or performance arts who show exceptional dedication and artistic excellence.",
            criteria_text: "Audition video or portfolio required.",
            tags: ["Performing Arts", "Arts", "Talent-Based"]
          }
        ];
        setScholarships(fallbackData);
        setAllScholarships(fallbackData);
        setLoading(false);
      });
  }, []);

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get all unique tags from scholarships
  const allTags = Array.from(
    new Set(allScholarships.flatMap(sch => sch.tags))
  ).sort();

  // Filter scholarships based on active filters
  const filteredScholarships = useMemo(() => {
    let filtered = [...allScholarships];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(sch =>
        sch.name.toLowerCase().includes(query) ||
        sch.description.toLowerCase().includes(query) ||
        sch.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sch => {
        const daysUntil = getDaysUntilDeadline(sch.deadline);
        if (statusFilter === 'active') {
          return daysUntil >= 0;
        } else {
          return daysUntil < 0;
        }
      });
    }

    // Amount filter
    if (amountFilter !== 'all') {
      filtered = filtered.filter(sch => {
        if (amountFilter === 'low') return sch.amount < 4000;
        if (amountFilter === 'medium') return sch.amount >= 4000 && sch.amount < 7000;
        if (amountFilter === 'high') return sch.amount >= 7000;
        return true;
      });
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(sch =>
        selectedTags.some(tag => sch.tags.includes(tag))
      );
    }

    return filtered;
  }, [searchQuery, statusFilter, amountFilter, selectedTags, allScholarships]);

  useEffect(() => {
    setScholarships(filteredScholarships);
  }, [filteredScholarships]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setAmountFilter('all');
    setSelectedTags([]);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Navbar - Minimal, sleek (shared with other pages) */}
      <header className="border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-8 py-5">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3 group">
              {/* Modern Logo with Icon */}
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  ScholarshipMatcher
                </span>
              </h1>
            </Link>
            
            {/* Profile Selector */}
            <div className="relative">
              {selectedStudent ? (
                <button
                  onClick={() => setShowProfileSelector(!showProfileSelector)}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:border-slate-900 transition-colors"
                >
                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-medium">Viewing as</div>
                    <div className="text-sm font-semibold text-slate-900">{selectedStudent.name}</div>
                  </div>
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => setShowProfileSelector(!showProfileSelector)}
                  className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Select Profile
                </button>
              )}

              {/* Profile Selector Dropdown */}
              {showProfileSelector && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileSelector(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-slate-200">
                      <h3 className="text-sm font-semibold text-slate-900">Select Your Profile</h3>
                      <p className="text-xs text-slate-500 mt-1">Choose a sample student profile to view personalized matches</p>
                    </div>
                    <div className="p-2">
                      {studentsLoading ? (
                        <div className="p-4 text-center text-sm text-slate-500">Loading profiles...</div>
                      ) : students.length === 0 ? (
                        <div className="p-4 text-center text-sm text-slate-500">No profiles available</div>
                      ) : (
                        students.map((student) => (
                          <button
                            key={student.id}
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowProfileSelector(false);
                            }}
                            className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                              selectedStudent?.id === student.id
                                ? 'bg-slate-900 text-white'
                                : 'hover:bg-slate-50 text-slate-900'
                            }`}
                          >
                            <div className="font-semibold text-sm">{student.name}</div>
                            <div className={`text-xs mt-1 ${
                              selectedStudent?.id === student.id ? 'text-slate-300' : 'text-slate-500'
                            }`}>
                              {student.field_of_study} • {student.year} Year • GPA: {student.gpa}
                            </div>
                          </button>
                        ))
                      )}
                      {selectedStudent && (
                        <button
                          onClick={() => {
                            setSelectedStudent(null);
                            setShowProfileSelector(false);
                          }}
                          className="w-full text-left p-3 rounded-lg mt-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm transition-colors"
                        >
                          Clear Selection
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Profile Banner */}
      {selectedStudent && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-blue-600 font-medium mb-1">Your Profile</div>
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{selectedStudent.name}</div>
                    <div className="text-xs text-slate-600">
                      {selectedStudent.field_of_study} • {selectedStudent.year} Year • GPA: {selectedStudent.gpa}
                    </div>
                  </div>
                  <div className="text-xs text-blue-600">
                    {selectedStudent.achievements.length} achievements • {selectedStudent.work_experience.length} work experiences
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-xs text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                Change Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 px-8 py-12 bg-gradient-to-b from-white to-blue-50/30">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-10">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
            </div>
            <h2 className="text-4xl font-light text-slate-900 text-center tracking-tight mb-3">
              Available Scholarships
            </h2>
            <p className="text-slate-600 text-center font-light">
              Discover opportunities tailored to your profile
            </p>
          </div>

          {/* Filters Section */}
          <div className="mb-8">
            {/* Search and Filter Toggle */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search scholarships by name, description, or tags&hellip;"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-11 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 border-2 border-blue-500 text-blue-600 font-semibold text-sm rounded-lg hover:bg-blue-50 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {(statusFilter !== 'all' || amountFilter !== 'all' || selectedTags.length > 0) && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {[statusFilter !== 'all' ? 1 : 0, amountFilter !== 'all' ? 1 : 0, selectedTags.length].reduce((a, b) => a + b, 0)}
                  </span>
                )}
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Status</label>
                    <div className="flex flex-wrap gap-2">
                      {(['all', 'active', 'expired'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => setStatusFilter(status)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            statusFilter === status
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          }`}
                        >
                          {status === 'all' ? 'All' : status === 'active' ? 'Active' : 'Expired'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Amount Range</label>
                    <div className="flex flex-wrap gap-2">
                      {(['all', 'low', 'medium', 'high'] as const).map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setAmountFilter(amount)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            amountFilter === amount
                              ? 'bg-cyan-600 text-white shadow-md'
                              : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
                          }`}
                        >
                          {amount === 'all' ? 'All' : amount === 'low' ? '< $4K' : amount === 'medium' ? '$4K-$7K' : '> $7K'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2 border-2 border-slate-300 text-slate-700 font-medium text-sm rounded-lg hover:bg-slate-50 transition-all"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>

                {/* Tags Filter */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedTags.includes(tag)
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Active Filters Display */}
            {(statusFilter !== 'all' || amountFilter !== 'all' || selectedTags.length > 0 || searchQuery) && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-slate-600 font-medium">Active filters:</span>
                {searchQuery && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-2">
                    Search: &quot;{searchQuery}&quot;
                    <button onClick={() => setSearchQuery('')} className="hover:text-blue-900">×</button>
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-2">
                    {statusFilter === 'active' ? 'Active' : 'Expired'}
                    <button onClick={() => setStatusFilter('all')} className="hover:text-blue-900">×</button>
                  </span>
                )}
                {amountFilter !== 'all' && (
                  <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full flex items-center gap-2">
                    {amountFilter === 'low' ? '< $4K' : amountFilter === 'medium' ? '$4K-$7K' : '> $7K'}
                    <button onClick={() => setAmountFilter('all')} className="hover:text-cyan-900">×</button>
                  </span>
                )}
                {selectedTags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full flex items-center gap-2">
                    {tag}
                    <button onClick={() => toggleTag(tag)} className="hover:text-blue-900">×</button>
                  </span>
                ))}
              </div>
            )}

            {/* Results Count */}
            <div className="mt-4 text-sm text-slate-600">
              Showing <span className="font-semibold text-blue-600">{scholarships.length}</span> of <span className="font-semibold">{allScholarships.length}</span> scholarships
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-slate-500 font-light">Loading scholarships...</div>
            </div>
          )}

          {/* Scholarships Grid */}
          {!loading && scholarships.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scholarships.map((scholarship) => {
                const daysUntil = getDaysUntilDeadline(scholarship.deadline);
                const isUrgent = daysUntil <= 30 && daysUntil > 0;
                const isExpired = daysUntil < 0;

                return (
                  <div
                    key={scholarship.id}
                    className="group bg-white border-2 border-blue-100 rounded-xl p-6 hover:border-blue-400 hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-white to-blue-50/50"
                    onClick={() => window.location.href = `/scholarships/${scholarship.id}`}
                  >
                    {/* Header with Amount */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                          {scholarship.name}
                        </h3>
                        <div className="text-2xl font-light bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                          {formatAmount(scholarship.amount)}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-600 font-light mb-4 leading-relaxed">
                      {truncateDescription(scholarship.description)}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {scholarship.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md border border-blue-200"
                        >
                          {tag}
                        </span>
                      ))}
                      {scholarship.tags.length > 3 && (
                        <span className="px-2.5 py-1 text-xs font-medium text-cyan-600 bg-cyan-50 rounded-md border border-cyan-200">
                          +{scholarship.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Deadline */}
                    <div className="pt-4 border-t border-blue-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xs text-blue-600 font-medium mb-1">Deadline</div>
                          <div className={`text-sm font-medium ${
                            isExpired 
                              ? 'text-red-600' 
                              : isUrgent 
                                ? 'text-green-600' 
                                : 'text-blue-700'
                          }`}>
                            {formatDate(scholarship.deadline)}
                          </div>
                        </div>
                        {!isExpired && (
                          <div className="text-right">
                            <div className="text-xs text-blue-600 font-medium mb-1">Days Left</div>
                            <div className={`text-sm font-semibold ${
                              isUrgent ? 'text-green-600' : 'text-cyan-600'
                            }`}>
                              {daysUntil}
                            </div>
                          </div>
                        )}
                        {isExpired && (
                          <span className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded border border-red-200">
                            Expired
                          </span>
                        )}
                      </div>
                    </div>

                    {/* View Details Link */}
                    <div className="mt-4 pt-4 border-t border-blue-100">
                      <div className="flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-800 transition-colors">
                        View Details
                        <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && scholarships.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-slate-400 text-lg font-light mb-2">No scholarships found</div>
              <div className="text-slate-500 text-sm">Check back later for new opportunities</div>
            </div>
          )}
        </div>
      </main>

      {/* Footer - Minimal, clean (shared with other pages) */}
      <footer className="border-t border-blue-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-600 to-cyan-500"></div>
              <div className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">ScholarshipMatcher</div>
            </div>
            <div className="text-xs text-slate-500">Made by: Areeba, Nour, AR</div>
          </div>
        </div>
      </footer>
    </div>
  );
}