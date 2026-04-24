import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';
import { readProjects, writeProjects } from '../storage';

const router = Router();

function getMockPlan(project: any): any {
  const due = new Date(project.dueDate);
  const now = new Date();
  const totalDays = Math.max(Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)), 14);
  const phase1End = new Date(now.getTime() + (totalDays * 0.25) * 86400000);
  const phase2End = new Date(now.getTime() + (totalDays * 0.6) * 86400000);
  const phase3End = new Date(now.getTime() + (totalDays * 0.85) * 86400000);

  const fmt = (d: Date) => d.toISOString().split('T')[0];
  const members: any[] = project.teamMembers || [];
  const getMember = (i: number) => members.length > 0 ? members[i % members.length].name : 'Team Member';

  return {
    phases: [
      {
        id: uuidv4(),
        name: 'Research & Planning',
        description: 'Gather requirements, research the topic, and create a detailed project plan.',
        startDate: fmt(now),
        endDate: fmt(phase1End),
        tasks: [
          {
            id: uuidv4(),
            title: 'Define project scope and objectives',
            description: 'Clearly outline what the project will deliver and set measurable goals.',
            assignedTo: getMember(0),
            deadline: fmt(new Date(now.getTime() + 2 * 86400000)),
            status: 'not_started',
            priority: 'high',
          },
          {
            id: uuidv4(),
            title: 'Literature review and background research',
            description: 'Research existing work related to the project topic and summarize key findings.',
            assignedTo: getMember(1),
            deadline: fmt(new Date(now.getTime() + 4 * 86400000)),
            status: 'not_started',
            priority: 'high',
          },
          {
            id: uuidv4(),
            title: 'Create project timeline and milestones',
            description: 'Break down the project into phases with clear milestones and deadlines.',
            assignedTo: getMember(0),
            deadline: fmt(phase1End),
            status: 'not_started',
            priority: 'medium',
          },
        ],
      },
      {
        id: uuidv4(),
        name: 'Development & Execution',
        description: 'Execute the core work of the project based on the plan.',
        startDate: fmt(phase1End),
        endDate: fmt(phase2End),
        tasks: [
          {
            id: uuidv4(),
            title: 'Implement core deliverable',
            description: 'Build or write the main component of the project deliverable.',
            assignedTo: getMember(1),
            deadline: fmt(new Date(phase1End.getTime() + (phase2End.getTime() - phase1End.getTime()) * 0.5)),
            status: 'not_started',
            priority: 'high',
          },
          {
            id: uuidv4(),
            title: 'Develop supporting materials',
            description: 'Create charts, diagrams, or additional content that supports the main deliverable.',
            assignedTo: getMember(2),
            deadline: fmt(new Date(phase1End.getTime() + (phase2End.getTime() - phase1End.getTime()) * 0.7)),
            status: 'not_started',
            priority: 'medium',
          },
          {
            id: uuidv4(),
            title: 'Team review and integration',
            description: 'All team members review each other\'s work and integrate everything cohesively.',
            assignedTo: getMember(0),
            deadline: fmt(phase2End),
            status: 'not_started',
            priority: 'high',
          },
        ],
      },
      {
        id: uuidv4(),
        name: 'Review & Refinement',
        description: 'Review all work, gather feedback, and refine the deliverables.',
        startDate: fmt(phase2End),
        endDate: fmt(phase3End),
        tasks: [
          {
            id: uuidv4(),
            title: 'Peer review of all sections',
            description: 'Each team member reviews the complete project and provides detailed feedback.',
            assignedTo: getMember(2),
            deadline: fmt(new Date(phase2End.getTime() + (phase3End.getTime() - phase2End.getTime()) * 0.5)),
            status: 'not_started',
            priority: 'medium',
          },
          {
            id: uuidv4(),
            title: 'Incorporate feedback and revisions',
            description: 'Address all feedback points and make necessary revisions to the project.',
            assignedTo: getMember(1),
            deadline: fmt(phase3End),
            status: 'not_started',
            priority: 'high',
          },
        ],
      },
      {
        id: uuidv4(),
        name: 'Finalization & Submission',
        description: 'Final checks, formatting, and submission of the completed project.',
        startDate: fmt(phase3End),
        endDate: fmt(due),
        tasks: [
          {
            id: uuidv4(),
            title: 'Final proofreading and formatting',
            description: 'Check for grammar, spelling, formatting consistency, and citation accuracy.',
            assignedTo: getMember(0),
            deadline: fmt(new Date(phase3End.getTime() + (due.getTime() - phase3End.getTime()) * 0.5)),
            status: 'not_started',
            priority: 'high',
          },
          {
            id: uuidv4(),
            title: 'Prepare submission package',
            description: 'Compile all files, documents, and materials into the required submission format.',
            assignedTo: getMember(1),
            deadline: fmt(new Date(due.getTime() - 2 * 86400000)),
            status: 'not_started',
            priority: 'high',
          },
          {
            id: uuidv4(),
            title: 'Submit project',
            description: 'Upload/submit the final project to the required platform before the deadline.',
            assignedTo: getMember(0),
            deadline: fmt(due),
            status: 'not_started',
            priority: 'high',
          },
        ],
      },
    ],
    meetingAgenda: [
      {
        id: uuidv4(),
        topic: 'Project Kickoff & Role Assignment',
        duration: '30 minutes',
        presenter: getMember(0),
        notes: 'Discuss project goals, assign roles, and confirm communication channels.',
      },
      {
        id: uuidv4(),
        topic: 'Research Findings Presentation',
        duration: '45 minutes',
        presenter: getMember(1),
        notes: 'Each member presents their research findings and key sources.',
      },
      {
        id: uuidv4(),
        topic: 'Progress Check-in & Blocker Resolution',
        duration: '30 minutes',
        presenter: getMember(0),
        notes: 'Review current progress, identify blockers, and redistribute work if needed.',
      },
      {
        id: uuidv4(),
        topic: 'Draft Review Meeting',
        duration: '60 minutes',
        presenter: getMember(2),
        notes: 'Walk through the complete draft together and collect feedback from all members.',
      },
      {
        id: uuidv4(),
        topic: 'Final Review & Submission Prep',
        duration: '30 minutes',
        presenter: getMember(0),
        notes: 'Final checks, confirm submission format, and assign submission responsibility.',
      },
    ],
    reminderSchedule: [
      {
        id: uuidv4(),
        date: fmt(new Date(now.getTime() + 1 * 86400000)),
        message: 'Kickoff meeting — confirm everyone\'s availability and set up communication channels.',
        type: 'meeting',
      },
      {
        id: uuidv4(),
        date: fmt(phase1End),
        message: 'Research phase complete — all team members should have submitted their research summaries.',
        type: 'milestone',
      },
      {
        id: uuidv4(),
        date: fmt(phase2End),
        message: 'Development phase complete — core deliverable should be drafted and integrated.',
        type: 'milestone',
      },
      {
        id: uuidv4(),
        date: fmt(phase3End),
        message: 'Refinement phase complete — final review should be done and revisions incorporated.',
        type: 'milestone',
      },
      {
        id: uuidv4(),
        date: fmt(new Date(due.getTime() - 3 * 86400000)),
        message: '3 days to deadline — finalize all content and begin formatting the submission.',
        type: 'deadline',
      },
      {
        id: uuidv4(),
        date: fmt(new Date(due.getTime() - 1 * 86400000)),
        message: '1 day to deadline — complete final proofreading and prepare submission package.',
        type: 'deadline',
      },
      {
        id: uuidv4(),
        date: fmt(due),
        message: 'SUBMISSION DAY — submit the project before the deadline!',
        type: 'deadline',
      },
    ],
    submissionChecklist: [
      {
        id: uuidv4(),
        item: 'All research sources are properly cited',
        completed: false,
        category: 'research',
      },
      {
        id: uuidv4(),
        item: 'Background research section is complete and reviewed',
        completed: false,
        category: 'research',
      },
      {
        id: uuidv4(),
        item: 'Core deliverable meets all assignment requirements',
        completed: false,
        category: 'content',
      },
      {
        id: uuidv4(),
        item: 'All team members have contributed and reviewed the work',
        completed: false,
        category: 'content',
      },
      {
        id: uuidv4(),
        item: 'Document is properly formatted per assignment guidelines',
        completed: false,
        category: 'formatting',
      },
      {
        id: uuidv4(),
        item: 'Grammar and spelling have been proofread',
        completed: false,
        category: 'formatting',
      },
      {
        id: uuidv4(),
        item: 'File is saved in the correct format (PDF/Word/etc.)',
        completed: false,
        category: 'submission',
      },
      {
        id: uuidv4(),
        item: 'Submission platform is accessible and login credentials are ready',
        completed: false,
        category: 'submission',
      },
      {
        id: uuidv4(),
        item: 'All required files are included in the submission package',
        completed: false,
        category: 'submission',
      },
      {
        id: uuidv4(),
        item: 'Submission confirmation email/receipt saved',
        completed: false,
        category: 'submission',
      },
    ],
  };
}

// POST /api/ai/generate
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { projectId } = req.body;
    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' });
    }

    const projects = readProjects();
    const project = projects.find((p: any) => p.id === projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    let plan: any;

    if (!process.env.OPENAI_API_KEY) {
      plan = getMockPlan(project);
    } else {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const memberList = (project.teamMembers || [])
        .map((m: any) => `${m.name} (${m.role || 'member'}, skills: ${m.skills || 'general'})`)
        .join(', ') || 'No team members listed';

      const prompt = `Create a detailed project plan for the following student group project:

Project Name: ${project.name}
Description: ${project.description}
Due Date: ${project.dueDate}
Team Members: ${memberList}
Today's Date: ${new Date().toISOString().split('T')[0]}

Generate a comprehensive project plan with:
1. Project phases (3-5 phases) with start/end dates and tasks assigned to specific team members
2. A meeting agenda (4-6 items) with specific topics relevant to this project
3. A reminder schedule (5-7 reminders) with specific dates from today until the due date
4. A submission checklist (8-12 items) grouped by category relevant to this type of project

Make all tasks, meetings, and reminders specific and relevant to the project description.
Assign tasks to the actual team members listed.
Use realistic date ranges between today (${new Date().toISOString().split('T')[0]}) and the due date (${project.dueDate}).

Return ONLY a JSON object with this exact structure (all fields required):
{
  "phases": [{ "id": "uuid", "name": "", "description": "", "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD", "tasks": [{ "id": "uuid", "title": "", "description": "", "assignedTo": "member name", "deadline": "YYYY-MM-DD", "status": "not_started", "priority": "high|medium|low" }] }],
  "meetingAgenda": [{ "id": "uuid", "topic": "", "duration": "X minutes", "presenter": "member name", "notes": "" }],
  "reminderSchedule": [{ "id": "uuid", "date": "YYYY-MM-DD", "message": "", "type": "milestone|deadline|meeting|general" }],
  "submissionChecklist": [{ "id": "uuid", "item": "", "completed": false, "category": "" }]
}`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert project manager who creates detailed project plans for student group projects. Always respond with valid JSON only, no markdown code blocks.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
      });

      const raw = completion.choices[0].message.content || '{}';
      plan = JSON.parse(raw);
    }

    const projectIndex = projects.findIndex((p: any) => p.id === projectId);
    projects[projectIndex] = {
      ...projects[projectIndex],
      phases: plan.phases || [],
      meetingAgenda: plan.meetingAgenda || [],
      reminderSchedule: plan.reminderSchedule || [],
      submissionChecklist: plan.submissionChecklist || [],
      aiGenerated: true,
    };
    writeProjects(projects);

    res.json(projects[projectIndex]);
  } catch (err: any) {
    console.error('AI generation error:', err);
    res.status(500).json({ error: err.message || 'AI generation failed' });
  }
});

export default router;
