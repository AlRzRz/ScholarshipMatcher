'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useStudentProfile } from '../../contexts/StudentProfileContext';

interface Scholarship {
  id: string;
  name: string;
  amount: number;
  deadline: string;
  description: string;
  criteria_text: string;
  tags: string[];
}

export default function ScholarshipDetailPage() {
  const params = useParams();
  const router = useRouter();
  const scholarshipId = params.id as string;
  const { selectedStudent, setSelectedStudent, students, loading: studentsLoading } = useStudentProfile();
  
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileSelector, setShowProfileSelector] = useState(false);

  useEffect(() => {
    // Fetch scholarship data
    fetch(`/api/scholarships/${scholarshipId}`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('API not available');
      })
      .then(data => {
        setScholarship(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback: find in hardcoded data
        const allScholarships: Scholarship[] = [
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
        
        const found = allScholarships.find(s => s.id === scholarshipId);
        if (found) {
          setScholarship(found);
        }
        setLoading(false);
      });
  }, [scholarshipId]);

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

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-8 py-5">
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
              ScholarshipMatcher
            </h1>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-slate-500 font-light">Loading scholarship details...</div>
        </main>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-8 py-5">
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
              ScholarshipMatcher
            </h1>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-slate-900 font-light text-lg mb-2">Scholarship not found</div>
            <button
              onClick={() => router.push('/scholarships')}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              ← Back to Scholarships
            </button>
          </div>
        </main>
      </div>
    );
  }

  const daysUntil = getDaysUntilDeadline(scholarship.deadline);
  const isUrgent = daysUntil <= 30 && daysUntil > 0;
  const isExpired = daysUntil < 0;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Navbar - Minimal, sleek (shared with other pages) */}
      <header className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-5">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
              ScholarshipMatcher
            </h1>
            
            {/* Profile Selector - Same as scholarships page */}
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

      {/* Profile Banner - Same as scholarships page */}
      {selectedStudent && (
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">Your Profile</div>
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{selectedStudent.name}</div>
                    <div className="text-xs text-slate-600">
                      {selectedStudent.field_of_study} • {selectedStudent.year} Year • GPA: {selectedStudent.gpa}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push('/scholarships')}
            className="mb-8 text-sm text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Scholarships
          </button>

          {/* Scholarship Header */}
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-0.5 bg-slate-900"></div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-light text-slate-900 leading-tight tracking-tight mb-4">
              {scholarship.name}
            </h1>
            <div className="text-3xl font-light text-slate-900 mb-6">
              {formatAmount(scholarship.amount)}
            </div>
          </div>

          {/* Scholarship Details Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-8 mb-6">
            {/* Key Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-slate-200">
              <div>
                <div className="text-xs text-slate-500 font-medium mb-2">Deadline</div>
                <div className={`text-lg font-semibold ${
                  isExpired 
                    ? 'text-red-600' 
                    : isUrgent 
                      ? 'text-amber-600' 
                      : 'text-slate-900'
                }`}>
                  {formatDate(scholarship.deadline)}
                </div>
                {!isExpired && (
                  <div className={`text-sm mt-1 ${
                    isUrgent ? 'text-amber-600' : 'text-slate-600'
                  }`}>
                    {daysUntil} {daysUntil === 1 ? 'day' : 'days'} remaining
                  </div>
                )}
                {isExpired && (
                  <div className="text-sm text-red-600 mt-1">This scholarship has expired</div>
                )}
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium mb-2">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {scholarship.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs font-medium text-slate-700 bg-slate-100 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">About This Scholarship</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 mb-3">Overview</h3>
                  <p className="text-slate-700 leading-relaxed font-light text-base">
                    {scholarship.description}
                  </p>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                  <h3 className="text-base font-semibold text-slate-900 mb-3">Eligibility Requirements</h3>
                  <p className="text-slate-700 leading-relaxed font-light">
                    {scholarship.criteria_text}
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-slate-900 mb-3">Award Details</h3>
                  <div className="space-y-2 text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Award Amount:</span>
                      <span className="font-light">{formatAmount(scholarship.amount)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Application Deadline:</span>
                      <span className={`font-light ${
                        isExpired ? 'text-red-600' : isUrgent ? 'text-amber-600' : 'text-slate-700'
                      }`}>
                        {formatDate(scholarship.deadline)}
                        {!isExpired && ` (${daysUntil} ${daysUntil === 1 ? 'day' : 'days'} remaining)`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-6 border-t border-slate-200">
              <button
                onClick={() => router.push(`/scholarships/${scholarshipId}/essay`)}
                disabled={isExpired}
                className={`w-full px-6 py-3 font-medium text-sm rounded-lg transition-all duration-300 ${
                  isExpired
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg'
                }`}
              >
                {isExpired ? 'Application Closed' : 'Apply Now'}
                {!isExpired && (
                  <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
                )}
              </button>
            </div>
          </div>

          {/* Expanded Student Profile (if selected) */}
          {selectedStudent && (
            <div className="bg-white border border-slate-200 rounded-lg p-8 mb-6">
              <div className="mb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-0.5 bg-slate-900"></div>
                </div>
                <h2 className="text-2xl font-light text-slate-900 text-center tracking-tight mb-2">
                  Your Profile
                </h2>
                <p className="text-sm text-slate-600 text-center font-light">
                  This information will be used to generate your personalized application
                </p>
              </div>

              <div className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-500 font-medium mb-1">Name</div>
                      <div className="text-sm text-slate-900 font-light">{selectedStudent.name}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium mb-1">Field of Study</div>
                      <div className="text-sm text-slate-900 font-light">{selectedStudent.field_of_study}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium mb-1">Degree Level</div>
                      <div className="text-sm text-slate-900 font-light capitalize">{selectedStudent.degree_level}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium mb-1">Year of Study</div>
                      <div className="text-sm text-slate-900 font-light">{selectedStudent.year} Year</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium mb-1">GPA</div>
                      <div className="text-sm text-slate-900 font-light">{selectedStudent.gpa}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium mb-1">Financial Need</div>
                      <div className="text-sm text-slate-900 font-light">{selectedStudent.financial_need ? 'Yes' : 'No'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium mb-1">Country</div>
                      <div className="text-sm text-slate-900 font-light">{selectedStudent.country}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium mb-1">Citizenship</div>
                      <div className="text-sm text-slate-900 font-light">{selectedStudent.citizenship}</div>
                    </div>
                  </div>
                </div>

                {/* Background */}
                {selectedStudent.background && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Background</h3>
                    <p className="text-slate-700 leading-relaxed font-light">
                      {selectedStudent.background}
                    </p>
                  </div>
                )}

                {/* Goals */}
                {selectedStudent.goals && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Career Goals</h3>
                    <p className="text-slate-700 leading-relaxed font-light">
                      {selectedStudent.goals}
                    </p>
                  </div>
                )}

                {/* Work Experience */}
                {selectedStudent.work_experience && selectedStudent.work_experience.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Work Experience</h3>
                    <div className="space-y-4">
                      {selectedStudent.work_experience.map((work, index) => (
                        <div key={index} className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                          <div className="mb-3">
                            <div className="text-base font-semibold text-slate-900">{work.role}</div>
                            <div className="text-sm text-slate-600 font-light">{work.company}</div>
                          </div>
                          {work.details && work.details.length > 0 && (
                            <ul className="list-disc list-inside space-y-1 mt-3">
                              {work.details.map((detail, detailIndex) => (
                                <li key={detailIndex} className="text-sm text-slate-700 font-light leading-relaxed">
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extracurriculars */}
                {selectedStudent.extracurriculars && selectedStudent.extracurriculars.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Extracurricular Activities</h3>
                    <div className="space-y-4">
                      {selectedStudent.extracurriculars.map((activity, index) => (
                        <div key={index} className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                          <div className="mb-3">
                            <div className="text-base font-semibold text-slate-900">{activity.role}</div>
                            <div className="text-sm text-slate-600 font-light">{activity.organization}</div>
                          </div>
                          {activity.details && activity.details.length > 0 && (
                            <ul className="list-disc list-inside space-y-1 mt-3">
                              {activity.details.map((detail, detailIndex) => (
                                <li key={detailIndex} className="text-sm text-slate-700 font-light leading-relaxed">
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements */}
                {selectedStudent.achievements && selectedStudent.achievements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Achievements</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {selectedStudent.achievements.map((achievement, index) => (
                        <li key={index} className="text-slate-700 font-light leading-relaxed">
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Stories */}
                {selectedStudent.stories && selectedStudent.stories.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Notable Experiences</h3>
                    <div className="space-y-4">
                      {selectedStudent.stories.map((story, index) => (
                        <div key={index} className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                          <p className="text-slate-700 leading-relaxed font-light">
                            {story}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Target Universities */}
                {selectedStudent.target_universities && selectedStudent.target_universities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Target Universities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudent.target_universities.map((university, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm font-light text-slate-700 bg-slate-100 rounded-md"
                        >
                          {university}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer - Minimal, clean (shared with other pages) */}
      <footer className="border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm font-medium text-slate-900">ScholarshipMatcher</div>
            <div className="text-xs text-slate-500">Made by: Areeba, Nour, AR</div>
          </div>
        </div>
      </footer>
    </div>
  );
}