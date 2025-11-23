'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useStudentProfile } from '../../../contexts/StudentProfileContext';

interface Scholarship {
  id: string;
  name: string;
  amount: number;
  deadline: string;
  description: string;
  criteria_text: string;
  tags: string[];
}

interface ScholarshipWeights {
  academics: number;
  leadership: number;
  community_service: number;
  financial_need: number;
  innovation: number;
}

interface ScholarshipAnalysis {
  scholarship_id: string;
  weights: ScholarshipWeights;
  tone: string[];
  priority_summary: string;
  evidence_snippets: string[];
}

interface StudentScholarshipMatch {
  student_id: string;
  scholarship_id: string;
  match_score: number;
  top_reasons: string[];
}

export default function EssayPage() {
  const params = useParams();
  const router = useRouter();
  const scholarshipId = params.id as string;
  const { selectedStudent, setSelectedStudent, students, loading: studentsLoading } = useStudentProfile();
  
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [scholarshipLoading, setScholarshipLoading] = useState(true);
  const [analysis, setAnalysis] = useState<ScholarshipAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [match, setMatch] = useState<StudentScholarshipMatch | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  
  const [generalEssay, setGeneralEssay] = useState('');
  const [specificEssay, setSpecificEssay] = useState('');
  const [generalEssayLoading, setGeneralEssayLoading] = useState(false);
  const [specificEssayLoading, setSpecificEssayLoading] = useState(false);
  const [generalEssayError, setGeneralEssayError] = useState<string | null>(null);
  const [specificEssayError, setSpecificEssayError] = useState<string | null>(null);
  
  const [editingGeneral, setEditingGeneral] = useState(false);
  const [editingSpecific, setEditingSpecific] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Fetch scholarship data
  useEffect(() => {
    fetch(`/api/scholarships/${scholarshipId}`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('API not available');
      })
      .then(data => {
        setScholarship(data);
        setScholarshipLoading(false);
      })
      .catch(() => {
        // Fallback: use hardcoded scholarship data (same as detail page)
        const allScholarships: Scholarship[] = [
          { id: "sch_001", name: "Excellence in STEM Scholarship", amount: 5000, deadline: "2025-12-01", description: "This scholarship supports high-achieving students pursuing degrees in science, technology, engineering, or mathematics. It emphasizes rigorous academic performance, commitment to STEM research, and demonstrated curiosity in scientific exploration.", criteria_text: "Must be an undergraduate or incoming freshman majoring in a STEM discipline. Minimum GPA of 3.5. Applicants must submit a personal essay and one faculty recommendation.", tags: ["STEM", "Merit", "Undergraduate"] },
          { id: "sch_002", name: "Community Impact Leaders Award", amount: 3000, deadline: "2025-10-15", description: "Awarded to students who demonstrate exceptional commitment to community service and social impact through sustained volunteer work, advocacy, or community leadership.", criteria_text: "Open to all majors. Must provide documentation of at least 100 hours of community service and an essay describing long-term community impact.", tags: ["Community Service", "Leadership", "Undergraduate", "Social Impact"] },
          { id: "sch_003", name: "Future Innovators Engineering Grant", amount: 8000, deadline: "2025-11-20", description: "Supports engineering students who have demonstrated hands-on innovation, participation in maker projects, robotics, engineering competitions, or technical invention.", criteria_text: "Applicants must submit a portfolio of engineering work, project descriptions, or prototypes. 3.0 GPA minimum.", tags: ["Engineering", "Innovation", "Project-Based", "Undergraduate"] },
          { id: "sch_004", name: "Arts & Creative Expression Scholarship", amount: 2500, deadline: "2025-08-30", description: "Designed for students pursuing visual arts, design, performance, or creative writing who exhibit exceptional artistic vision and originality.", criteria_text: "Portfolio submission required. Open to both undergraduate and graduate artists in any creative field.", tags: ["Arts", "Creative", "Portfolio", "Undergraduate", "Graduate"] },
          { id: "sch_005", name: "First-Generation Student Success Scholarship", amount: 4000, deadline: "2025-09-10", description: "Provides financial support for first-generation college students who demonstrate resilience, academic promise, and commitment to overcoming barriers to education.", criteria_text: "Open to first-generation students only. Must submit short personal history essay.", tags: ["First-Generation", "Equity", "Undergraduate"] },
          { id: "sch_006", name: "Women in Computing Award", amount: 7000, deadline: "2025-12-05", description: "Recognizes outstanding women pursuing degrees in computer science, cybersecurity, AI, or related computing fields. Focuses on leadership potential in tech.", criteria_text: "Must be a woman majoring in computing. Demonstrated interest via projects, internships, or clubs.", tags: ["Women in Tech", "Computing", "STEM", "Diversity"] },
          { id: "sch_007", name: "Global Leadership & Cultural Exchange Scholarship", amount: 3500, deadline: "2025-07-01", description: "Supports students who have shown commitment to global citizenship, cross-cultural understanding, language learning, or international exchange.", criteria_text: "Essay required describing global or multicultural experiences. Open to all majors.", tags: ["Global Studies", "Leadership", "Cultural Exchange"] },
          { id: "sch_008", name: "Environmental Sustainability Fellowship", amount: 6000, deadline: "2025-11-01", description: "Awarded to students pursuing environmental science or sustainability-focused initiatives. Prioritizes applicants with hands-on conservation experience.", criteria_text: "Open to students in environmental fields. Project proposal or sustainability initiative required.", tags: ["Environment", "Sustainability", "STEM", "Project-Based"] },
          { id: "sch_009", name: "Future Educators Teaching Scholarship", amount: 3000, deadline: "2025-09-30", description: "Supports future K–12 educators dedicated to improving education quality, equity, and student engagement.", criteria_text: "Must be majoring in education. Teaching philosophy essay required.", tags: ["Education", "Teaching", "Undergraduate"] },
          { id: "sch_010", name: "Entrepreneurial Spirit Innovation Grant", amount: 5000, deadline: "2025-10-01", description: "For students developing entrepreneurial ventures or early-stage startups. Focuses on creativity, business vision, and feasibility.", criteria_text: "Business plan or prototype required. Open to any major.", tags: ["Entrepreneurship", "Innovation", "Business"] },
          { id: "sch_011", name: "Healthcare Heroes Scholarship", amount: 4500, deadline: "2025-12-10", description: "Supports students entering healthcare professions, emphasizing compassion, patient advocacy, and clinical excellence.", criteria_text: "Must be enrolled in a health sciences or pre-med program. Healthcare service experience recommended.", tags: ["Healthcare", "Pre-Med", "Nursing"] },
          { id: "sch_012", name: "Cybersecurity Achievement Award", amount: 6500, deadline: "2025-11-15", description: "Recognizes students pursuing cybersecurity fields with strong analytical and defensive security skills.", criteria_text: "Applicants must submit a security project, CTF write-up, or research summary.", tags: ["Cybersecurity", "STEM", "Computing"] },
          { id: "sch_013", name: "Journalism Integrity & Media Scholarship", amount: 2800, deadline: "2025-09-12", description: "Award for aspiring journalists who demonstrate excellence in storytelling, ethical reporting, or media innovation.", criteria_text: "Writing samples required. Open to journalism and communication majors.", tags: ["Journalism", "Media", "Writing"] },
          { id: "sch_014", name: "Rural Student Achievement Grant", amount: 5000, deadline: "2025-08-20", description: "Supports high-potential students from rural or underserved areas aiming to pursue higher education.", criteria_text: "Must be from a rural community. Essay describing background and goals required.", tags: ["Rural", "Equity", "Undergraduate"] },
          { id: "sch_015", name: "Business Leadership Merit Scholarship", amount: 4000, deadline: "2025-10-18", description: "For business majors with a record of leadership, teamwork, and professional ambition.", criteria_text: "Resume and leadership essay required. 3.3 GPA minimum.", tags: ["Business", "Leadership", "Merit"] },
          { id: "sch_016", name: "Creative Writing Emerging Authors Prize", amount: 2000, deadline: "2025-07-25", description: "Awarded to emerging writers with exceptional skill in fiction, poetry, or narrative nonfiction.", criteria_text: "Submit 2–3 writing samples. Open to all majors.", tags: ["Writing", "Creative", "Arts"] },
          { id: "sch_017", name: "Public Service & Policy Scholarship", amount: 6000, deadline: "2025-11-30", description: "Supports students pursuing political science, public policy, or social justice work aimed at improving civic life.", criteria_text: "Public service experience required. Policy-interest statement recommended.", tags: ["Public Policy", "Civic Engagement", "Leadership"] },
          { id: "sch_018", name: "AI & Machine Learning Research Fellowship", amount: 9000, deadline: "2025-12-20", description: "Recognizes students contributing to machine learning research, model development, or AI ethics studies.", criteria_text: "Research summary or published work preferred. Open to grad and undergrad.", tags: ["AI", "Machine Learning", "Research", "STEM"] },
          { id: "sch_019", name: "LGBTQ+ Student Empowerment Scholarship", amount: 3500, deadline: "2025-09-05", description: "Supports LGBTQ+ students who demonstrate advocacy, leadership, and commitment to equality.", criteria_text: "Open to LGBTQ+ identifying students. Advocacy essay required.", tags: ["LGBTQ+", "Equity", "Leadership"] },
          { id: "sch_020", name: "Humanities & Social Sciences Research Award", amount: 3000, deadline: "2025-10-09", description: "Supports students conducting significant humanities or social science research projects.", criteria_text: "Research proposal required. Faculty recommendation encouraged.", tags: ["Humanities", "Research", "Social Sciences"] },
          { id: "sch_021", name: "Future Nurses Compassion Grant", amount: 2500, deadline: "2025-08-15", description: "Award for nursing students demonstrating empathy, patient advocacy, and commitment to healthcare equity.", criteria_text: "Must be in a nursing program. Clinical experience strongly valued.", tags: ["Nursing", "Healthcare", "Compassion"] },
          { id: "sch_022", name: "Robotics & Automation Innovators Scholarship", amount: 7500, deadline: "2025-10-28", description: "Supports robotics students involved in automation design, AI-driven robotics, or competitive robotics teams.", criteria_text: "Project portfolio required. Participation in robotics competitions is a plus.", tags: ["Robotics", "Engineering", "STEM"] },
          { id: "sch_023", name: "Diversity in Law & Justice Scholarship", amount: 6000, deadline: "2025-09-25", description: "Promotes diversity in the legal field by supporting underrepresented students pursuing pre-law or legal studies.", criteria_text: "Open to underrepresented groups in law. Essay required.", tags: ["Law", "Diversity", "Social Justice"] },
          { id: "sch_024", name: "Data Science Impact Award", amount: 6500, deadline: "2025-11-22", description: "For students using data science to solve real-world problems in business, medicine, or social issues.", criteria_text: "Data project submission required. Open to all data-oriented majors.", tags: ["Data Science", "STEM", "Impact"] },
          { id: "sch_025", name: "Performing Arts Talent Scholarship", amount: 3000, deadline: "2025-06-30", description: "Recognizes gifted performers in music, theater, dance, or performance arts who show exceptional dedication and artistic excellence.", criteria_text: "Audition video or portfolio required.", tags: ["Performing Arts", "Arts", "Talent-Based"] }
        ];
        const found = allScholarships.find(s => s.id === scholarshipId);
        if (found) {
          setScholarship(found);
        }
        setScholarshipLoading(false);
      });
  }, [scholarshipId]);

  // Fetch scholarship analysis when scholarship is loaded
  useEffect(() => {
    if (!scholarship) return;

    let cancelled = false;

    const fetchAnalysis = async () => {
      setAnalysisLoading(true);

      try {
        const res = await fetch('http://localhost:8000/api/analyze-scholarship', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(scholarship),
        });

        if (!res.ok) {
          throw new Error(`Analysis failed: ${res.statusText}`);
        }

        const data = await res.json();
        
        if (!cancelled) {
          setAnalysis(data);
          setAnalysisLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error analyzing scholarship:', err);
          setAnalysisLoading(false);
        }
      }
    };

    fetchAnalysis();

    return () => {
      cancelled = true;
    };
  }, [scholarship]);

  // Fetch student-scholarship match when scholarship, analysis, and student are all available
  useEffect(() => {
    if (!scholarship || !analysis || !selectedStudent) {
      setMatch(null);
      return;
    }

    let cancelled = false;

    const fetchMatch = async () => {
      setMatchLoading(true);

      try {
        const res = await fetch('http://localhost:8000/api/match-student', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            student: selectedStudent,
            scholarship: scholarship,
            analysis: analysis,
          }),
        });

        if (!res.ok) {
          throw new Error(`Match failed: ${res.statusText}`);
        }

        const data = await res.json();
        
        if (!cancelled) {
          setMatch(data);
          setMatchLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error matching student to scholarship:', err);
          setMatchLoading(false);
        }
      }
    };

    fetchMatch();

    return () => {
      cancelled = true;
    };
  }, [scholarship, analysis, selectedStudent]);

  // Generate both essays when all required data is available
  useEffect(() => {
    // Generate general essay (only needs student)
    if (selectedStudent && generalEssay === '') {
      let cancelled = false;

      const generateGeneral = async () => {
        setGeneralEssayLoading(true);
        setGeneralEssayError(null);

        try {
          const res = await fetch('http://localhost:8000/api/essay/general', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(selectedStudent),
          });

          if (!res.ok) {
            throw new Error('Failed to generate general essay');
          }

          const data = await res.json();
          
          if (!cancelled) {
            setGeneralEssay(data.essay || '');
            setGeneralEssayLoading(false);
          }
        } catch (err) {
          if (!cancelled) {
            console.error('Error generating general essay:', err);
            setGeneralEssayError(err instanceof Error ? err.message : 'Failed to generate general essay');
            setGeneralEssayLoading(false);
          }
        }
      };

      generateGeneral();

      return () => {
        cancelled = true;
      };
    }
  }, [selectedStudent, generalEssay]);

  // Generate specific essay (needs student, scholarship, analysis, and match)
  useEffect(() => {
    if (!selectedStudent || !scholarship || !analysis || !match || specificEssay !== '') {
      return;
    }

    let cancelled = false;

    const generateSpecific = async () => {
      setSpecificEssayLoading(true);
      setSpecificEssayError(null);

      try {
        const res = await fetch('http://localhost:8000/api/essay/specific', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            student: selectedStudent,
            scholarship: scholarship,
            analysis: analysis,
            match: match,
          }),
        });

        if (!res.ok) {
          throw new Error('Failed to generate specific essay');
        }

        const data = await res.json();
        
        if (!cancelled) {
          setSpecificEssay(data.essay || '');
          setSpecificEssayLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error generating specific essay:', err);
          setSpecificEssayError(err instanceof Error ? err.message : 'Failed to generate specific essay');
          setSpecificEssayLoading(false);
        }
      }
    };

    generateSpecific();

    return () => {
      cancelled = true;
    };
  }, [selectedStudent, scholarship, analysis, match, specificEssay]);

  const handleEditGeneral = () => {
    setEditingGeneral(true);
  };

  const handleSaveGeneral = () => {
    setEditingGeneral(false);
  };

  const handleEditSpecific = () => {
    setEditingSpecific(true);
  };

  const handleSaveSpecific = () => {
    setEditingSpecific(false);
  };

  const handleChooseAndSubmit = (essayType: 'general' | 'specific') => {
    setShowConfetti(true);
    setTimeout(() => {
      router.push('/scholarships');
    }, 2000);
  };

  const handleSubmit = () => {
    setEditingGeneral(false);
    setEditingSpecific(false);
    setIsSubmitted(true);
  };

  // Confetti effect component
  const Confetti = () => {
    if (!showConfetti) return null;

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

    return (
      <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
        {Array.from({ length: 100 }).map((_, i) => {
          const color = colors[Math.floor(Math.random() * colors.length)];
          const left = Math.random() * 100;
          const delay = Math.random() * 2;
          const duration = 2 + Math.random() * 2;
          const rotation = Math.random() * 360;
          
          return (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-sm"
              style={{
                left: `${left}%`,
                top: '-20px',
                backgroundColor: color,
                animation: `confetti-fall ${duration}s linear ${delay}s forwards`,
                transform: `rotate(${rotation}deg)`,
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <Confetti />
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
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 px-8 py-12 bg-gradient-to-b from-white to-blue-50/30">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push(`/scholarships/${scholarshipId}`)}
            className="mb-8 text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Scholarship
          </button>

          {isSubmitted ? (
            /* Success Message */
            <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-light text-slate-900 mb-3">
                  Essay Submitted Successfully!
                </h2>
                <p className="text-slate-600 font-light mb-8">
                  Your application has been submitted for this scholarship.
                </p>
                <button
                  onClick={() => router.push('/scholarships')}
                  className="px-8 py-3 bg-slate-900 text-white font-medium text-sm rounded-lg hover:bg-slate-800 hover:shadow-lg transition-all duration-300"
                >
                  Back to Scholarships List
                </button>
              </div>
            </div>
          ) : (
            /* Essay Editor - Two Essays Side by Side */
            <div className="space-y-8">
              {/* Header */}
              <div>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
                </div>
                <h2 className="text-3xl font-light text-slate-900 text-center tracking-tight mb-2">
                  AI Generated Essays
                </h2>
                <p className="text-sm text-slate-600 text-center font-light">
                  Compare your general essay with the scholarship-specific version
                </p>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* General Essay */}
                <div className="bg-white border-2 border-blue-100 rounded-xl p-8 shadow-sm hover:shadow-lg hover:border-blue-300 transition-shadow duration-300">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-cyan-500 rounded"></div>
                      <h3 className="text-xl font-semibold text-slate-900">General Essay</h3>
                    </div>
                    <p className="text-sm text-slate-600 font-light">
                      A Common App style personal essay based on your profile
                    </p>
                  </div>

                  {!selectedStudent && (
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-12 text-center min-h-[600px] flex flex-col items-center justify-center">
                      <svg className="w-16 h-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div className="text-slate-600 font-medium mb-2">Select a Profile</div>
                      <div className="text-slate-500 text-sm font-light max-w-xs">
                        Choose a student profile from the header to generate your personalized essay
                      </div>
                    </div>
                  )}

                  {selectedStudent && generalEssayLoading && (
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-12 text-center min-h-[600px] flex flex-col items-center justify-center">
                      <div className="relative w-16 h-16 mb-6">
                        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <div className="text-blue-700 font-medium mb-2">Generating Your Essay</div>
                      <div className="text-blue-600 text-sm font-light">Our AI is crafting your personalized essay...</div>
                    </div>
                  )}

                  {selectedStudent && generalEssayError && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-red-800 font-semibold text-sm">Generation Error</div>
                      </div>
                      <div className="text-red-700 text-sm font-light">{generalEssayError}</div>
                    </div>
                  )}

                  {selectedStudent && !generalEssayLoading && (
                    <>
                      {editingGeneral ? (
                        <textarea
                          className="w-full px-6 py-4 border-2 border-blue-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-300 font-light leading-relaxed resize-y min-h-[600px] text-base"
                          value={generalEssay}
                          onChange={(e) => setGeneralEssay(e.target.value)}
                          placeholder="Your essay will appear here..."
                        />
                      ) : (
                        <div className="bg-gradient-to-br from-blue-50/50 to-white border-2 border-blue-200 rounded-lg p-8 min-h-[600px] shadow-inner">
                          <p className="text-slate-800 leading-relaxed font-light whitespace-pre-wrap text-base">
                            {generalEssay || 'Loading essay...'}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {selectedStudent && !generalEssayLoading && generalEssay && (
                    <div className="mt-6 flex gap-3">
                      {editingGeneral ? (
                        <button
                          onClick={handleSaveGeneral}
                          className="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold text-sm rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                          Save Changes
                        </button>
                      ) : (
                        <>
                        <button
                          onClick={handleEditGeneral}
                          className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold text-sm rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                          Edit
                        </button>
                          <button
                            onClick={() => handleChooseAndSubmit('general')}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm rounded-lg hover:from-blue-700 hover:to-cyan-600 hover:shadow-lg transition-all duration-300"
                          >
                            Choose & Submit
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Specific Essay */}
                <div className="bg-white border-2 border-blue-100 rounded-xl p-8 shadow-sm hover:shadow-lg hover:border-blue-300 transition-shadow duration-300">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-cyan-500 rounded"></div>
                      <h3 className="text-xl font-semibold text-slate-900">Scholarship-Specific Essay</h3>
                    </div>
                    <p className="text-sm text-slate-600 font-light">
                      Tailored specifically for this scholarship based on your profile and match analysis
                    </p>
                  </div>

                  {!selectedStudent && (
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-dashed border-blue-300 rounded-lg p-12 text-center min-h-[600px] flex flex-col items-center justify-center">
                      <svg className="w-16 h-16 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div className="text-blue-700 font-medium mb-2">Select a Profile</div>
                      <div className="text-blue-600 text-sm font-light max-w-xs">
                        Choose a student profile from the header to generate your personalized essay
                      </div>
                    </div>
                  )}

                  {selectedStudent && (!scholarship || !analysis || !match) && (
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-12 text-center min-h-[600px] flex flex-col items-center justify-center">
                      <div className="relative w-16 h-16 mb-6">
                        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <div className="text-blue-700 font-medium mb-2">
                        {scholarshipLoading || analysisLoading || matchLoading
                          ? 'Loading Scholarship Data'
                          : 'Preparing Analysis'}
                      </div>
                      <div className="text-blue-600 text-sm font-light max-w-xs">
                        {scholarshipLoading || analysisLoading || matchLoading
                          ? 'Fetching scholarship details and running AI analysis...'
                          : 'Waiting for scholarship analysis and compatibility match...'}
                      </div>
                    </div>
                  )}

                  {selectedStudent && scholarship && analysis && match && specificEssayLoading && (
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-12 text-center min-h-[600px] flex flex-col items-center justify-center">
                      <div className="relative w-16 h-16 mb-6">
                        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <div className="text-blue-700 font-medium mb-2">Generating Your Essay</div>
                      <div className="text-blue-600 text-sm font-light">Crafting a scholarship-specific essay tailored to your profile...</div>
                    </div>
                  )}

                  {selectedStudent && scholarship && analysis && match && specificEssayError && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-red-800 font-semibold text-sm">Generation Error</div>
                      </div>
                      <div className="text-red-700 text-sm font-light">{specificEssayError}</div>
                    </div>
                  )}

                  {selectedStudent && scholarship && analysis && match && !specificEssayLoading && (
                    <>
                      {editingSpecific ? (
                        <textarea
                          className="w-full px-6 py-4 border-2 border-blue-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-300 font-light leading-relaxed resize-y min-h-[600px] text-base"
                          value={specificEssay}
                          onChange={(e) => setSpecificEssay(e.target.value)}
                          placeholder="Your essay will appear here..."
                        />
                      ) : (
                        <div className="bg-gradient-to-br from-blue-50/50 to-white border-2 border-blue-200 rounded-lg p-8 min-h-[600px] shadow-inner">
                          <p className="text-slate-800 leading-relaxed font-light whitespace-pre-wrap text-base">
                            {specificEssay || 'Loading essay...'}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {selectedStudent && scholarship && analysis && match && !specificEssayLoading && specificEssay && (
                    <div className="mt-6 flex gap-3">
                      {editingSpecific ? (
                        <button
                          onClick={handleSaveSpecific}
                          className="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold text-sm rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                          Save Changes
                        </button>
                      ) : (
                        <>
                        <button
                          onClick={handleEditSpecific}
                          className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold text-sm rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                          Edit
                        </button>
                          <button
                            onClick={() => handleChooseAndSubmit('specific')}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm rounded-lg hover:from-blue-700 hover:to-cyan-600 hover:shadow-lg transition-all duration-300"
                          >
                            Choose & Submit
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

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