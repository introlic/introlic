"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, ChevronDown, Check, User, Mail, Phone, MapPin, Search, Clock, Slash } from 'lucide-react';
import CustomAlert from '../CustomAlert';

// Custom Social Brand Icons
const InstagramIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.058-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4.162 4.162 0 1 1 0-8.324 4.162 4.162 0 0 1 0 8.324zM18.406 4.164a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
  </svg>
);

const RedditIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.75-1.64-5.99-1.72l1.23-3.87 3.97.85c.1.75.74 1.33 1.51 1.33 1.1 0 2-2 2-2-.52.53-.78.8-1.33.8l-4.26-.91c-.13-.03-.27.04-.32.17l-1.4 4.41c-2.31.06-4.5.71-6.17 1.73-.55-.74-1.44-1.21-2.42-1.21-1.65 0-3 1.35-3 3 0 1.25.77 2.32 1.86 2.77-.04.24-.06.49-.06.73 0 3.86 4.49 7 10 7s10-3.14 10-7c0-.24-.02-.49-.06-.73 1.09-.45 1.86-1.52 1.86-2.77zM7 13.25c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm11.5 4.5c-1.84 1.84-5.16 1.84-7 0-.19-.2-.19-.51 0-.7.2-.2.51-.2.71 0 1.45 1.45 4.13 1.45 5.58 0 .2-.2.51-.2.71 0 .19.19.19.51 0 .7zm-.5-2c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5z" />
  </svg>
);

const DiscordIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
  </svg>
);

const LinkedinIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 .001-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const XIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.931zm-1.294 19.497h2.039L6.486 3.24H4.298l13.309 17.41z" />
  </svg>
);

const GithubIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

// All Indian States and Union Territories
const INDIA_STATES = [
  // States
  { value: 'AN_PRADESH', label: 'Andhra Pradesh', type: 'State' },
  { value: 'ARUNACHAL', label: 'Arunachal Pradesh', type: 'State' },
  { value: 'ASSAM', label: 'Assam', type: 'State' },
  { value: 'BIHAR', label: 'Bihar', type: 'State' },
  { value: 'CHHATTISGARH', label: 'Chhattisgarh', type: 'State' },
  { value: 'GOA', label: 'Goa', type: 'State' },
  { value: 'GUJARAT', label: 'Gujarat', type: 'State' },
  { value: 'HARYANA', label: 'Haryana', type: 'State' },
  { value: 'HP', label: 'Himachal Pradesh', type: 'State' },
  { value: 'JHARKHAND', label: 'Jharkhand', type: 'State' },
  { value: 'KARNATAKA', label: 'Karnataka', type: 'State' },
  { value: 'KERALA', label: 'Kerala', type: 'State' },
  { value: 'MP', label: 'Madhya Pradesh', type: 'State' },
  { value: 'MAHARASHTRA', label: 'Maharashtra', type: 'State' },
  { value: 'MANIPUR', label: 'Manipur', type: 'State' },
  { value: 'MEGHALAYA', label: 'Meghalaya', type: 'State' },
  { value: 'MIZORAM', label: 'Mizoram', type: 'State' },
  { value: 'NAGALAND', label: 'Nagaland', type: 'State' },
  { value: 'ODISHA', label: 'Odisha', type: 'State' },
  { value: 'PUNJAB', label: 'Punjab', type: 'State' },
  { value: 'RAJASTHAN', label: 'Rajasthan', type: 'State' },
  { value: 'SIKKIM', label: 'Sikkim', type: 'State' },
  { value: 'TAMIL_NADU', label: 'Tamil Nadu', type: 'State' },
  { value: 'TELANGANA', label: 'Telangana', type: 'State' },
  { value: 'TRIPURA', label: 'Tripura', type: 'State' },
  { value: 'UP', label: 'Uttar Pradesh', type: 'State' },
  { value: 'UTTARAKHAND', label: 'Uttarakhand', type: 'State' },
  { value: 'WEST_BENGAL', label: 'West Bengal', type: 'State' },
  // Union Territories
  { value: 'AN_ISLANDS', label: 'Andaman & Nicobar Islands', type: 'UT' },
  { value: 'CHANDIGARH', label: 'Chandigarh', type: 'UT' },
  { value: 'DNH_DD', label: 'Dadra & Nagar Haveli and Daman & Diu', type: 'UT' },
  { value: 'DELHI', label: 'Delhi (NCT)', type: 'UT' },
  { value: 'JAMMU_KASHMIR', label: 'Jammu & Kashmir', type: 'UT' },
  { value: 'LADAKH', label: 'Ladakh', type: 'UT' },
  { value: 'LAKSHADWEEP', label: 'Lakshadweep', type: 'UT' },
  { value: 'PUDUCHERRY', label: 'Puducherry', type: 'UT' },
];

interface SubjectOption {
  value: string;
  label: string;
}

const SUBJECT_OPTIONS: SubjectOption[] = [
  { value: 'JOIN_MOVEMENT', label: 'Join Movement' },
  { value: 'GENERAL_QUERY', label: 'General Query' },
  { value: 'BUG_REPORT', label: 'Bug Report' },
  { value: 'CAREERS', label: 'Career Option' },
  { value: 'FUNDING_PARTNERS', label: 'Funding & Partners' },
  { value: 'PROJECT_IDEA', label: 'Submit Project Idea' },
  { value: 'SUPPORT', label: 'Technical / Operational Support' }
];

interface SocialPlatform {
  id: string;
  label: string;
  placeholder: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  shadow: string;
}

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { id: 'instagram', label: 'Instagram', placeholder: '@username', icon: InstagramIcon, color: '#e1306c', shadow: 'rgba(225,48,108,0.15)' },
  { id: 'reddit', label: 'Reddit', placeholder: 'u/username', icon: RedditIcon, color: '#ff4500', shadow: 'rgba(255,69,0,0.15)' },
  { id: 'discord', label: 'Discord', placeholder: 'username', icon: DiscordIcon, color: '#5865f2', shadow: 'rgba(88,101,242,0.15)' },
  { id: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/username', icon: LinkedinIcon, color: '#0077b5', shadow: 'rgba(0,119,181,0.15)' },
  { id: 'x', label: 'X / Twitter', placeholder: '@username', icon: XIcon, color: '#ffffff', shadow: 'rgba(255,255,255,0.15)' },
  { id: 'github', label: 'GitHub', placeholder: 'github.com/username', icon: GithubIcon, color: '#24292e', shadow: 'rgba(255,255,255,0.15)' }
];

interface GenderOption {
  value: string;
  label: string;
}

const GENDER_OPTIONS: GenderOption[] = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'NON_BINARY', label: 'Non-Binary' },
  { value: 'PREFER_NOT_TO_SAY', label: 'Prefer Not to Say' }
];

// Generate Date of Birth Options
const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => {
  const d = (i + 1).toString().padStart(2, '0');
  return { value: d, label: (i + 1).toString() };
});

const MONTH_OPTIONS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' }
];

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: currentYear - 1939 }, (_, i) => {
  const y = (currentYear - i).toString();
  return { value: y, label: y };
});

export default function ContactContent() {
  const searchParams = useSearchParams();

  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: "System Notification",
    message: "",
    type: "info" as "info" | "success" | "error"
  });

  const triggerAlert = (message: string, type: "info" | "success" | "error" = "info", title: string = "System Notification") => {
    setAlertState({
      isOpen: true,
      title,
      message,
      type
    });
  };

  const initialSubject = (() => {
    const p = searchParams.get('subject');
    return p && SUBJECT_OPTIONS.find(o => o.value === p) ? p : 'GENERAL_QUERY';
  })();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    gender: 'PREFER_NOT_TO_SAY',
    state: '',
    subject: initialSubject,
    message: ''
  });

  const [selectedSocials, setSelectedSocials] = useState<string[]>([]);
  const [socialHandles, setSocialHandles] = useState<Record<string, string>>({
    instagram: '',
    reddit: '',
    discord: '',
    linkedin: '',
    x: '',
    github: ''
  });
  const [isSocialsSkipped, setIsSocialsSkipped] = useState(false);

  // Dropdown open states
  const [isSubjectOpen, setIsSubjectOpen] = useState(false);
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const changeStateOpen = (val: boolean) => {
    setIsStateOpen(val);
    if (!val) {
      setStateSearch('');
    }
  };

  // Helper to close all custom dropdown menus before opening one
  const closeAllDropdowns = () => {
    setIsSubjectOpen(false);
    setIsGenderOpen(false);
    setIsDayOpen(false);
    setIsMonthOpen(false);
    setIsYearOpen(false);
    changeStateOpen(false);
  };

  // Search input state inside custom State dropdown
  const [stateSearch, setStateSearch] = useState('');

  const [isFocused, setIsFocused] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Refs for click outside triggers
  const subjectRef = useRef<HTMLDivElement>(null);
  const genderRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);

  const charLimit = 5000;

  // Click outside to close custom menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (subjectRef.current && !subjectRef.current.contains(target)) setIsSubjectOpen(false);
      if (genderRef.current && !genderRef.current.contains(target)) setIsGenderOpen(false);
      if (dayRef.current && !dayRef.current.contains(target)) setIsDayOpen(false);
      if (monthRef.current && !monthRef.current.contains(target)) setIsMonthOpen(false);
      if (yearRef.current && !yearRef.current.contains(target)) setIsYearOpen(false);
      if (stateRef.current && !stateRef.current.contains(target)) changeStateOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSocialPlatform = (id: string) => {
    setIsSocialsSkipped(false);
    setSelectedSocials((prev) => {
      if (prev.includes(id)) {
        return prev.filter((p) => p !== id);
      } else {
        if (prev.length >= 2) {
          return [...prev.slice(1), id];
        }
        return [...prev, id];
      }
    });
  };

  const handleHandleChange = (id: string, value: string) => {
    setSocialHandles((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubjectSelect = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      subject: value
    }));
    setIsSubjectOpen(false);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= charLimit) {
      setFormData((prev) => ({
        ...prev,
        message: text
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      triggerAlert("Please fill in all required fields.", "error", "Missing Fields");
      return;
    }

    const hasAnyDob = formData.dobDay || formData.dobMonth || formData.dobYear;
    const hasAllDob = formData.dobDay && formData.dobMonth && formData.dobYear;
    if (hasAnyDob && !hasAllDob) {
      triggerAlert("Please complete all sections of the Date of Birth or leave them empty.", "error", "Invalid Date of Birth");
      return;
    }

    setIsSending(true);

    try {
      const filteredSocials: Record<string, string> = {};
      if (!isSocialsSkipped) {
        selectedSocials.forEach((platform) => {
          if (socialHandles[platform]) {
            filteredSocials[platform] = socialHandles[platform];
          }
        });
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          socialHandles: Object.keys(filteredSocials).length > 0 ? filteredSocials : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setIsSent(true);
    } catch (error) {
      const err = error as Error;
      triggerAlert(err.message || "Something went wrong. Please try again.", "error", "Submission Error");
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      dobDay: '',
      dobMonth: '',
      dobYear: '',
      gender: 'PREFER_NOT_TO_SAY',
      state: '',
      subject: 'GENERAL_QUERY',
      message: ''
    });
    setSelectedSocials([]);
    setIsSocialsSkipped(false);
    setSocialHandles({
      instagram: '',
      reddit: '',
      discord: '',
      linkedin: '',
      x: '',
      github: ''
    });
    setIsSent(false);
  };

  const selectedSubjectLabel = SUBJECT_OPTIONS.find(opt => opt.value === formData.subject)?.label || 'Select Subject';
  const selectedGenderLabel = GENDER_OPTIONS.find(opt => opt.value === formData.gender)?.label || 'Select Gender';
  const selectedStateLabel = INDIA_STATES.find(opt => opt.value === formData.state)?.label || 'Select State / UT';
  
  const selectedDayLabel = DAY_OPTIONS.find(opt => opt.value === formData.dobDay)?.label || 'Day';
  const selectedMonthLabel = MONTH_OPTIONS.find(opt => opt.value === formData.dobMonth)?.label || 'Month';
  const selectedYearLabel = YEAR_OPTIONS.find(opt => opt.value === formData.dobYear)?.label || 'Year';

  // Filter States / UTs list based on search bar text
  const filteredStates = INDIA_STATES.filter(opt =>
    opt.label.toLowerCase().includes(stateSearch.toLowerCase())
  );
  const statesGroup = filteredStates.filter(s => s.type === 'State');
  const utsGroup = filteredStates.filter(s => s.type === 'UT');

  return (
    <section className="relative min-h-screen bg-black pt-36 pb-28 overflow-hidden flex flex-col justify-center items-center selection:bg-[#00a3ff]/30">
      
      {/* Laser-refined atmospheric background details */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 65% 45% at 50% -10%, rgba(0,163,255,0.03) 0%, transparent 80%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 85% 40% at 50% 110%, rgba(0,80,200,0.02) 0%, transparent 80%)' }} />
        {/* Subtle grid of tiny dots */}
        <div 
          className="absolute inset-0 opacity-[0.015]" 
          style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`, backgroundSize: '48px 48px' }} 
        />
      </div>

      <div className="max-w-[1300px] w-full mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* LEFT COLUMN: Editorial Brand Content */}
          <div className="lg:col-span-5 text-left">
            
            {/* Premium Metallic Gradient Title */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-black tracking-tightest leading-[1.05] text-white">
                Shape The <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a3ff] via-blue-400 to-[#00d1ff]">
                  Future Together.
                </span>
              </h1>
              <p className="text-zinc-500 text-sm sm:text-base font-medium leading-relaxed max-w-md">
                Whether you want to join our movement, report a query, or explore funding partnerships, we&apos;re ready to connect. Submit your details to route your message to our core team.
              </p>
            </div>

            {/* Quick Contact Uplink Info Cards */}
            <div className="space-y-5 pt-4 mt-14">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0c0c0e]/60 border border-zinc-900 hover:border-zinc-800 transition-colors duration-300">
                <div className="w-10 h-10 rounded-xl bg-[#00a3ff]/5 border border-[#00a3ff]/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#00a3ff]" />
                </div>
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-zinc-600">Email Address</div>
                  <a href="mailto:inquiries@introlic.in" className="text-sm font-bold text-zinc-300 hover:text-[#00a3ff] transition-colors">
                    inquiries@introlic.in
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0c0c0e]/60 border border-zinc-900 hover:border-zinc-800 transition-colors duration-300">
                <div className="w-10 h-10 rounded-xl bg-[#00a3ff]/5 border border-[#00a3ff]/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#00a3ff]" />
                </div>
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-zinc-600">Corporate Base</div>
                  <div className="text-sm font-bold text-zinc-300">Delhi, India</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0c0c0e]/60 border border-zinc-900 hover:border-zinc-800 transition-colors duration-300">
                <div className="w-10 h-10 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-zinc-600">Typical Response</div>
                  <div className="text-sm font-bold text-zinc-300">Within 24 Hours</div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Premium Normal Form Card */}
          <div className="lg:col-span-7">
            <div className="relative p-5 sm:p-7 md:p-10 rounded-3xl border border-zinc-900 bg-[#0c0c0e] shadow-[0_24px_50px_rgba(0,0,0,0.7)]">
              
              {/* Subtle inner card border highlights */}
              <div className="absolute inset-[1px] rounded-3xl pointer-events-none" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.015) 0%, transparent 60%)', borderRadius: 'inherit' }} />

              <AnimatePresence mode="wait">
                {!isSending && !isSent ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    {/* Grid Row 1: Name and Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Name Input */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block">
                          Full Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            onFocus={() => setIsFocused('name')}
                            onBlur={() => setIsFocused(null)}
                            placeholder="Enter your name"
                            className="w-full bg-[#121215] border border-zinc-800 focus:ring-0 text-white placeholder-zinc-700 font-bold py-2.5 px-4 pl-10 rounded-xl outline-none transition-all duration-300 text-xs"
                            style={{ 
                              borderColor: isFocused === 'name' ? '#00a3ff' : undefined,
                              boxShadow: isFocused === 'name' ? '0 0 20px rgba(0, 163, 255, 0.12)' : 'none'
                            }}
                          />
                          <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors duration-300 ${isFocused === 'name' ? 'text-[#00a3ff]' : 'text-zinc-600'}`} />
                        </div>
                      </div>

                      {/* Email Input */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block">
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            onFocus={() => setIsFocused('email')}
                            onBlur={() => setIsFocused(null)}
                            placeholder="Enter email address"
                            className="w-full bg-[#121215] border border-zinc-800 focus:ring-0 text-white placeholder-zinc-700 font-bold py-2.5 px-4 pl-10 rounded-xl outline-none transition-all duration-300 text-xs"
                            style={{ 
                              borderColor: isFocused === 'email' ? '#00a3ff' : undefined,
                              boxShadow: isFocused === 'email' ? '0 0 20px rgba(0, 163, 255, 0.12)' : 'none'
                            }}
                          />
                          <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors duration-300 ${isFocused === 'email' ? 'text-[#00a3ff]' : 'text-zinc-600'}`} />
                        </div>
                      </div>

                    </div>

                    {/* Grid Row 2: Mobile Number (Optional) & Segmented Date of Birth */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Phone Number */}
                      <div className="space-y-1.5 text-left">
                        <div className="flex items-center justify-between">
                          <label className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block">
                            Mobile Number
                          </label>
                          <span className="text-[8px] font-mono px-1 rounded border text-zinc-600 border-zinc-800 bg-zinc-900/30">Optional</span>
                        </div>
                        <div className="relative">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                            <Phone className={`w-3.5 h-3.5 transition-colors duration-300 ${isFocused === 'phone' ? 'text-[#00a3ff]' : 'text-zinc-600'}`} />
                            <span className="text-zinc-600 text-[10px] font-mono border-r border-zinc-800 pr-1.5">+91</span>
                          </div>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                              setFormData({ ...formData, phone: val });
                            }}
                            onFocus={() => setIsFocused('phone')}
                            onBlur={() => setIsFocused(null)}
                            placeholder="Mobile number"
                            maxLength={10}
                            className="w-full bg-[#121215] border border-zinc-800 focus:ring-0 text-white placeholder-zinc-700 font-bold py-2.5 px-4 pl-16 rounded-xl outline-none transition-all duration-300 text-xs"
                            style={{ 
                              borderColor: isFocused === 'phone' ? '#00a3ff' : undefined,
                              boxShadow: isFocused === 'phone' ? '0 0 20px rgba(0, 163, 255, 0.12)' : 'none'
                            }}
                          />
                          {formData.phone.length > 0 && (
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[8px] font-mono tabular-nums" style={{ color: formData.phone.length === 10 ? '#10b981' : 'rgba(255,255,255,0.2)' }}>
                              {formData.phone.length}/10
                            </span>
                          )}
                        </div>
                      </div>

                      {/* DOB: 3 Segmented Custom Controls */}
                      <div className="space-y-1.5 text-left">
                        <div className="flex justify-between items-center">
                          <label className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block">
                            Date of Birth <span className="text-[8px] text-zinc-600 font-normal lowercase italic">(optional)</span>
                          </label>
                          {(formData.dobDay || formData.dobMonth || formData.dobYear) && (
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, dobDay: '', dobMonth: '', dobYear: '' }));
                              }}
                              className="text-[8px] font-mono text-red-500 hover:text-red-400 hover:underline cursor-pointer"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        
                        {/* Segment container (we style button borders to let dropdowns escape safely) */}
                        <div className="grid grid-cols-3 bg-[#121215] border border-zinc-800 rounded-xl relative">
                          
                          {/* Segment 1: Day */}
                          <div className="relative" ref={dayRef}>
                            <button
                              type="button"
                              onClick={() => {
                                const next = !isDayOpen;
                                closeAllDropdowns();
                                setIsDayOpen(next);
                              }}
                              className="w-full text-center text-white font-bold py-2.5 px-2 rounded-l-xl outline-none hover:bg-zinc-900/40 transition-colors cursor-pointer text-xs flex justify-between items-center"
                            >
                              <span className={formData.dobDay === '' ? 'text-zinc-600' : 'text-zinc-300'}>
                                {selectedDayLabel}
                              </span>
                              <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${isDayOpen ? 'rotate-180 text-[#00a3ff]' : ''}`} />
                            </button>
                            <AnimatePresence>
                              {isDayOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                                  transition={{ duration: 0.12 }}
                                  className="absolute z-50 w-[120px] left-0 mt-1 bg-[#080808] border border-zinc-800 rounded-xl overflow-y-auto max-h-40 shadow-2xl backdrop-blur-md custom-scrollbar"
                                >
                                  {DAY_OPTIONS.map((opt) => (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => {
                                        setFormData(prev => ({ ...prev, dobDay: opt.value }));
                                        setIsDayOpen(false);
                                      }}
                                      className="w-full px-3 py-1.5 text-left text-xs font-bold transition-colors cursor-pointer hover:bg-[#121215] text-zinc-400 hover:text-white"
                                      style={{ color: formData.dobDay === opt.value ? '#00a3ff' : undefined }}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Segment 2: Month */}
                          <div className="relative border-l border-r border-zinc-800" ref={monthRef}>
                            <button
                              type="button"
                              onClick={() => {
                                const next = !isMonthOpen;
                                closeAllDropdowns();
                                setIsMonthOpen(next);
                              }}
                              className="w-full text-center text-white font-bold py-2.5 px-2 outline-none hover:bg-zinc-900/40 transition-colors cursor-pointer text-xs flex justify-between items-center"
                            >
                              <span className={formData.dobMonth === '' ? 'text-zinc-600' : 'text-zinc-300'}>
                                {formData.dobMonth ? selectedMonthLabel.substring(0, 3) : 'Month'}
                              </span>
                              <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${isMonthOpen ? 'rotate-180 text-[#00a3ff]' : ''}`} />
                            </button>
                            <AnimatePresence>
                              {isMonthOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                                  transition={{ duration: 0.12 }}
                                  className="absolute z-50 w-[140px] left-1/2 -translate-x-1/2 mt-1 bg-[#080808] border border-zinc-800 rounded-xl overflow-y-auto max-h-40 shadow-2xl backdrop-blur-md custom-scrollbar"
                                >
                                  {MONTH_OPTIONS.map((opt) => (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => {
                                        setFormData(prev => ({ ...prev, dobMonth: opt.value }));
                                        setIsMonthOpen(false);
                                      }}
                                      className="w-full px-3 py-1.5 text-left text-xs font-bold transition-colors cursor-pointer hover:bg-[#121215] text-zinc-400 hover:text-white"
                                      style={{ color: formData.dobMonth === opt.value ? '#00a3ff' : undefined }}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Segment 3: Year */}
                          <div className="relative" ref={yearRef}>
                            <button
                              type="button"
                              onClick={() => {
                                const next = !isYearOpen;
                                closeAllDropdowns();
                                setIsYearOpen(next);
                              }}
                              className="w-full text-center text-white font-bold py-2.5 px-2 rounded-r-xl outline-none hover:bg-zinc-900/40 transition-colors cursor-pointer text-xs flex justify-between items-center"
                            >
                              <span className={formData.dobYear === '' ? 'text-zinc-600' : 'text-zinc-300'}>
                                {selectedYearLabel}
                              </span>
                              <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${isYearOpen ? 'rotate-180 text-[#00a3ff]' : ''}`} />
                            </button>
                            <AnimatePresence>
                              {isYearOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                                  transition={{ duration: 0.12 }}
                                  className="absolute z-50 w-[120px] right-0 mt-1 bg-[#080808] border border-zinc-800 rounded-xl overflow-y-auto max-h-40 shadow-2xl backdrop-blur-md custom-scrollbar"
                                >
                                  {YEAR_OPTIONS.map((opt) => (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => {
                                        setFormData(prev => ({ ...prev, dobYear: opt.value }));
                                        setIsYearOpen(false);
                                      }}
                                      className="w-full px-3 py-1.5 text-left text-xs font-bold transition-colors cursor-pointer hover:bg-[#121215] text-zinc-400 hover:text-white"
                                      style={{ color: formData.dobYear === opt.value ? '#00a3ff' : undefined }}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                        </div>
                      </div>

                    </div>

                    {/* Grid Row 3: Custom Gender & State/UT Custom Dropdown with search filter */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Gender Custom Dropdown */}
                      <div className="space-y-1.5 text-left" ref={genderRef}>
                        <label className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block">
                          Gender
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              const next = !isGenderOpen;
                              closeAllDropdowns();
                              setIsGenderOpen(next);
                            }}
                            className="w-full bg-[#121215] border border-zinc-800 text-white font-bold py-2.5 px-4 rounded-xl outline-none transition-all duration-300 text-xs flex justify-between items-center cursor-pointer text-left"
                            style={{
                              borderColor: isGenderOpen ? '#00a3ff' : undefined,
                              boxShadow: isGenderOpen ? '0 0 20px rgba(0, 163, 255, 0.12)' : 'none'
                            }}
                          >
                            <span className={formData.gender === 'PREFER_NOT_TO_SAY' && selectedGenderLabel === 'Prefer Not to Say' ? 'text-zinc-500 font-bold' : 'text-zinc-300'}>
                              {selectedGenderLabel}
                            </span>
                            <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-300 ${isGenderOpen ? 'rotate-180 text-[#00a3ff]' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {isGenderOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -4, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -4, scale: 0.95 }}
                                transition={{ duration: 0.12 }}
                                className="absolute z-50 w-full mt-1 bg-[#080808] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md"
                              >
                                <div className="py-1">
                                  {GENDER_OPTIONS.map((opt) => (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => {
                                        setFormData(prev => ({ ...prev, gender: opt.value }));
                                        setIsGenderOpen(false);
                                      }}
                                      className="w-full px-4 py-2 text-left text-xs font-bold flex justify-between items-center transition-colors cursor-pointer hover:bg-[#121215] text-zinc-400 hover:text-white"
                                      style={{ color: formData.gender === opt.value ? '#00a3ff' : undefined }}
                                    >
                                      {opt.label}
                                      {formData.gender === opt.value && <Check className="w-3 h-3 text-[#00a3ff]" />}
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* State / UT Custom Dropdown with search filter bar */}
                      <div className="space-y-1.5 text-left" ref={stateRef}>
                        <div className="flex items-center justify-between">
                          <label className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block">
                            State / UT
                          </label>
                          <span className="text-[8px] font-mono px-1 rounded border text-zinc-600 border-zinc-800 bg-zinc-900/30">Optional</span>
                        </div>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              const next = !isStateOpen;
                              closeAllDropdowns();
                              changeStateOpen(next);
                            }}
                            className="w-full bg-[#121215] border border-zinc-800 font-bold py-2.5 px-4 pl-9 rounded-xl outline-none transition-all duration-300 text-xs flex justify-between items-center cursor-pointer text-left"
                            style={{
                              borderColor: isStateOpen ? '#00a3ff' : undefined,
                              boxShadow: isStateOpen ? '0 0 20px rgba(0, 163, 255, 0.12)' : 'none',
                              color: formData.state === '' ? 'rgba(156,163,175,0.4)' : '#d1d5db'
                            }}
                          >
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                            <span className="truncate pr-4">{selectedStateLabel}</span>
                            <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-300 shrink-0 ${isStateOpen ? 'rotate-180 text-[#00a3ff]' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {isStateOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -4, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -4, scale: 0.95 }}
                                transition={{ duration: 0.12 }}
                                className="absolute z-50 w-full mt-1 bg-[#080808] border border-zinc-800 rounded-xl overflow-y-auto max-h-60 shadow-2xl backdrop-blur-md custom-scrollbar"
                              >
                                {/* Search Bar inside State dropdown */}
                                <div className="p-2 border-b border-zinc-900 sticky top-0 bg-[#080808] z-10">
                                  <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500" />
                                    <input
                                      type="text"
                                      value={stateSearch}
                                      onChange={(e) => setStateSearch(e.target.value)}
                                      onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing
                                      placeholder="Filter State / UT..."
                                      className="w-full bg-[#121215] border border-zinc-800 rounded-lg py-1.5 pl-8 pr-2.5 text-[11px] text-white placeholder-zinc-600 focus:outline-none focus:border-[#00a3ff] transition-all"
                                    />
                                  </div>
                                </div>

                                <div className="py-1">
                                  {filteredStates.length === 0 ? (
                                    <div className="px-4 py-6 text-center text-xs text-zinc-600">
                                      No results matching &quot;{stateSearch}&quot;
                                    </div>
                                  ) : (
                                    <>
                                      {/* States Group */}
                                      {statesGroup.length > 0 && (
                                        <>
                                          <div className="px-4 py-1.5 text-[9px] font-mono tracking-widest text-[#00a3ff] uppercase bg-zinc-900/10">
                                            States
                                          </div>
                                          {statesGroup.map((opt) => (
                                            <button
                                              key={opt.value}
                                              type="button"
                                              onClick={() => {
                                                setFormData(prev => ({ ...prev, state: opt.value }));
                                                changeStateOpen(false);
                                              }}
                                              className="w-full px-4 py-2 text-left text-xs font-bold transition-colors cursor-pointer hover:bg-[#121215] text-zinc-400 hover:text-white"
                                              style={{ color: formData.state === opt.value ? '#00a3ff' : undefined }}
                                            >
                                              {opt.label}
                                              {formData.state === opt.value && <Check className="w-3 h-3 text-[#00a3ff]" />}
                                            </button>
                                          ))}
                                        </>
                                      )}

                                      {/* UTs Group */}
                                      {utsGroup.length > 0 && (
                                        <>
                                          <div className="px-4 py-1.5 text-[9px] font-mono tracking-widest text-amber-500/80 uppercase bg-zinc-900/10 border-t border-zinc-900 mt-1">
                                            Union Territories
                                          </div>
                                          {utsGroup.map((opt) => (
                                            <button
                                              key={opt.value}
                                              type="button"
                                              onClick={() => {
                                                setFormData(prev => ({ ...prev, state: opt.value }));
                                                changeStateOpen(false);
                                              }}
                                              className="w-full px-4 py-2 text-left text-xs font-bold flex justify-between items-center transition-colors cursor-pointer hover:bg-[#121215] text-zinc-400 hover:text-white"
                                              style={{ color: formData.state === opt.value ? '#00a3ff' : undefined }}
                                            >
                                              {opt.label}
                                              {formData.state === opt.value && <Check className="w-3 h-3 text-[#00a3ff]" />}
                                            </button>
                                          ))}
                                        </>
                                      )}
                                    </>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                    </div>

                    {/* Subject Custom Dropdown */}
                    <div className="space-y-1.5 text-left" ref={subjectRef}>
                      <label className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block">
                        Select Subject
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            const next = !isSubjectOpen;
                            closeAllDropdowns();
                            setIsSubjectOpen(next);
                          }}
                          className="w-full bg-[#121215] border border-zinc-800 text-white font-bold py-2.5 px-4 rounded-xl outline-none transition-all duration-300 text-xs flex justify-between items-center cursor-pointer text-left"
                          style={{ 
                            borderColor: isSubjectOpen ? '#00a3ff' : undefined,
                            boxShadow: isSubjectOpen ? '0 0 20px rgba(0, 163, 255, 0.12)' : 'none'
                          }}
                        >
                          <span className="text-zinc-300">
                            {selectedSubjectLabel}
                          </span>
                          <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-300 ${isSubjectOpen ? 'rotate-180 text-[#00a3ff]' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {isSubjectOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -4, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -4, scale: 0.95 }}
                              transition={{ duration: 0.12 }}
                              className="absolute z-50 w-full mt-1 bg-[#080808] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md custom-scrollbar"
                            >
                              <div className="py-1">
                                {SUBJECT_OPTIONS.map((opt) => (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => handleSubjectSelect(opt.value)}
                                    className="w-full px-4 py-2.5 text-left text-xs font-bold flex justify-between items-center transition-colors cursor-pointer hover:bg-[#121215] text-zinc-400 hover:text-white"
                                    style={{ color: formData.subject === opt.value ? '#00a3ff' : undefined }}
                                  >
                                    {opt.label}
                                    {formData.subject === opt.value && <Check className="w-3 h-3 text-[#00a3ff]" />}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Social platform selections (up to 2 platforms) */}
                    <div className="space-y-3 text-left">
                      <div className="flex justify-between items-center">
                        <label className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block">
                          Social Handles (Optional)
                        </label>
                        <span className="text-[8px] font-mono text-zinc-500">
                          {selectedSocials.length}/2 Selected
                        </span>
                      </div>

                      {/* Chip Row with SVGs */}
                      <div className="flex flex-wrap gap-2">
                        {/* Skip / None Special Chip */}
                        <button
                          type="button"
                          onClick={() => {
                            const nextSkip = !isSocialsSkipped;
                            setIsSocialsSkipped(nextSkip);
                            if (nextSkip) {
                              setSelectedSocials([]);
                            }
                          }}
                          className="py-1.5 px-3 rounded-full border text-[10px] font-bold transition-all duration-300 cursor-pointer flex items-center gap-1.5 hover:scale-[1.03]"
                          style={{
                            backgroundColor: isSocialsSkipped ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                            borderColor: isSocialsSkipped ? '#ef4444' : 'rgba(255,255,255,0.06)',
                            color: isSocialsSkipped ? '#ffffff' : 'rgba(255, 255, 255, 0.35)',
                            boxShadow: isSocialsSkipped ? '0 0 15px rgba(239, 68, 68, 0.1)' : 'none'
                          }}
                        >
                          <Slash className="w-3.5 h-3.5" style={{ color: isSocialsSkipped ? '#ef4444' : undefined }} />
                          Skip / None
                        </button>
                        {SOCIAL_PLATFORMS.map((platform) => {
                          const isSelected = selectedSocials.includes(platform.id);
                          const PlatformIcon = platform.icon;
                          return (
                            <button
                              key={platform.id}
                              type="button"
                              onClick={() => {
                                if (isSocialsSkipped) setIsSocialsSkipped(false);
                                toggleSocialPlatform(platform.id);
                              }}
                              className="py-1.5 px-3 rounded-full border text-[10px] font-bold transition-all duration-300 cursor-pointer flex items-center gap-1.5 hover:scale-[1.03]"
                              style={{
                                backgroundColor: isSelected ? `${platform.color}15` : 'transparent',
                                borderColor: isSelected ? platform.color : 'rgba(255,255,255,0.03)',
                                color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.35)',
                                boxShadow: isSelected ? `0 0 15px ${platform.shadow}` : 'none'
                              }}
                            >
                              <PlatformIcon className="w-3.5 h-3.5" style={{ color: isSelected ? platform.color : undefined }} />
                              {platform.label}
                            </button>
                          );
                        })}
                      </div>

                      {isSocialsSkipped && (
                        <div className="text-[10px] text-zinc-500 font-mono italic mt-1.5">
                          ✓ Social profiles skipped. No social profiles will be linked.
                        </div>
                      )}

                      {/* Handles Text Fields */}
                      <AnimatePresence>
                        {selectedSocials.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-2.5 pt-1.5 overflow-hidden"
                          >
                            {selectedSocials.map((platformId) => {
                              const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId);
                              if (!platform) return null;
                              return (
                                <motion.div
                                  key={platform.id}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="relative flex items-center bg-[#121215] border border-zinc-800 rounded-xl py-2 px-3.5 gap-3"
                                >
                                  <span className="text-[9px] font-mono font-bold uppercase w-20 shrink-0" style={{ color: platform.color }}>
                                    {platform.label}:
                                  </span>
                                  <input
                                    type="text"
                                    required
                                    value={socialHandles[platform.id]}
                                    onChange={(e) => handleHandleChange(platform.id, e.target.value)}
                                    placeholder={platform.placeholder}
                                    className="bg-transparent border-none focus:ring-0 text-white placeholder-zinc-700 font-bold p-0 text-xs w-full outline-none"
                                  />
                                </motion.div>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Textarea with limit of 4,000 characters */}
                    <div className="space-y-1.5 text-left">
                      <div className="flex justify-between items-center">
                        <label className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block">
                          Message / Request Details
                        </label>
                        <span className="text-[8px] font-mono tabular-nums" style={{ color: formData.message.length >= charLimit * 0.9 ? '#ef4444' : formData.message.length >= charLimit * 0.7 ? '#f59e0b' : 'rgba(255, 255, 255, 0.2)' }}>
                          {formData.message.length} / {charLimit.toLocaleString()}
                        </span>
                      </div>
                      <textarea
                        required
                        rows={7}
                        value={formData.message}
                        onChange={handleMessageChange}
                        onFocus={() => setIsFocused('message')}
                        onBlur={() => setIsFocused(null)}
                        placeholder="Write details of your message..."
                        className="w-full bg-[#121215] border border-zinc-800 focus:ring-0 text-white placeholder-zinc-700 font-bold py-3 px-4 rounded-xl outline-none transition-all duration-300 resize-y text-xs leading-relaxed"
                        style={{ 
                          borderColor: isFocused === 'message' ? '#00a3ff' : undefined,
                          boxShadow: isFocused === 'message' ? '0 0 20px rgba(0, 163, 255, 0.12)' : 'none',
                          minHeight: '140px'
                        }}
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full relative px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest text-white cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden group mt-4"
                      style={{ 
                        backgroundColor: '#00a3ff',
                        boxShadow: '0 4px 25px rgba(0, 163, 255, 0.25)'
                      }}
                    >
                      <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                      Send Message
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>

                  </motion.form>
                ) : isSending ? (
                  <motion.div
                    key="sending"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-24 text-center space-y-4"
                  >
                    <div className="w-8 h-8 border-2 border-white/10 border-t-[#00a3ff] rounded-full animate-spin mx-auto" />
                    <span className="text-[9px] font-mono tracking-widest uppercase text-zinc-500 block">
                      Transmitting Coordinates...
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-16 text-center space-y-8"
                  >
                    <div className="flex flex-col items-center gap-5">
                      <div className="p-3.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.08)]">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xl font-black text-white tracking-tighter">Request Received</h4>
                        <p className="text-zinc-500 text-xs max-w-sm mx-auto leading-relaxed">
                          Thank you for submitting your coordinates. Our team has received your profile query and will correspond with you shortly.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleReset}
                      className="px-5 py-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-bold text-[10px] tracking-wider uppercase transition-all duration-300 cursor-pointer"
                    >
                      Initiate New Request
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
      <CustomAlert 
        isOpen={alertState.isOpen} 
        onClose={() => setAlertState(prev => ({ ...prev, isOpen: false }))} 
        title={alertState.title} 
        message={alertState.message} 
        type={alertState.type} 
      />
    </section>
  );
}
