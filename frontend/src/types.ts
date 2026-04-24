export interface TeamMember {
  id: string;
  name: string;
  email: string;
  skills: string;
  role: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  deadline: string;
  status: 'not_started' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export interface Phase {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  tasks: Task[];
}

export interface MeetingAgendaItem {
  id: string;
  topic: string;
  duration: string;
  presenter: string;
  notes: string;
}

export interface Reminder {
  id: string;
  date: string;
  message: string;
  type: 'milestone' | 'deadline' | 'meeting' | 'general';
}

export interface ChecklistItem {
  id: string;
  item: string;
  completed: boolean;
  category: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  createdAt: string;
  teamMembers: TeamMember[];
  phases: Phase[];
  meetingAgenda: MeetingAgendaItem[];
  reminderSchedule: Reminder[];
  submissionChecklist: ChecklistItem[];
  aiGenerated: boolean;
}
