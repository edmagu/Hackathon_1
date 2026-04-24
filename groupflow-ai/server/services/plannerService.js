const defaultTemplates = {
  presentation: [
    'Define presentation scope and key questions',
    'Research and collect credible sources',
    'Draft narrative and speaking outline',
    'Design slide deck visuals',
    'Rehearse timing and speaker transitions',
    'Finalize bibliography and citations'
  ],
  report: [
    'Define report structure and responsibilities',
    'Collect references and data',
    'Draft core sections',
    'Review for coherence and citations',
    'Edit and proofread final report'
  ],
  prototype: [
    'Define MVP requirements and success criteria',
    'Create low-fidelity prototype',
    'Implement core functionality',
    'Test and collect feedback',
    'Polish and prepare demonstration'
  ]
};

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function daysBefore(dateString, days) {
  const date = new Date(dateString);
  date.setDate(date.getDate() - days);
  return formatDate(date);
}

function pickTemplate(projectType = '') {
  const key = projectType.toLowerCase();
  if (key.includes('present')) return defaultTemplates.presentation;
  if (key.includes('report') || key.includes('essay')) return defaultTemplates.report;
  if (key.includes('prototype') || key.includes('app') || key.includes('build')) return defaultTemplates.prototype;
  return [
    'Clarify objectives and deliverables',
    'Research and gather materials',
    'Create first draft output',
    'Review and improve quality',
    'Finalize and prepare submission'
  ];
}

function generateFallbackPlan(project, teamMembers = []) {
  const templates = pickTemplate(project.projectType);
  const dueDate = project.dueDate;
  const members = teamMembers.length ? teamMembers : [{ id: 'member_unassigned', name: 'Unassigned' }];

  const tasks = templates.map((title, index) => {
    const assignee = members[index % members.length];
    const dueDaysBefore = Math.max(2, (templates.length - index) * 3);
    return {
      title,
      description: `Complete: ${title} for ${project.title}.`,
      assignedTo: assignee.id,
      assignedToName: assignee.name,
      dueDate: daysBefore(dueDate, dueDaysBefore),
      priority: index < 2 ? 'High' : index < 4 ? 'Medium' : 'Low',
      estimatedHours: index < 2 ? 4 : 3,
      status: 'todo'
    };
  });

  const milestones = [
    {
      title: 'Research complete',
      dueDate: daysBefore(dueDate, 14),
      description: 'All required resources and evidence gathered.'
    },
    {
      title: 'Draft complete',
      dueDate: daysBefore(dueDate, 7),
      description: 'First full project draft prepared.'
    },
    {
      title: 'Final review complete',
      dueDate: daysBefore(dueDate, 2),
      description: 'Quality check and final polishing complete.'
    }
  ];

  const meetings = [
    {
      title: 'Kickoff planning meeting',
      date: daysBefore(dueDate, 18),
      agenda: 'Confirm scope, assign roles, and align timeline.'
    },
    {
      title: 'Final rehearsal/review meeting',
      date: daysBefore(dueDate, 3),
      agenda: 'Run-through and last-minute improvements.'
    }
  ];

  const checklistItems = [
    { title: 'All members have assigned tasks', completed: false },
    { title: 'Sources are documented and cited', completed: false },
    { title: 'Final deliverable reviewed by team', completed: false },
    { title: 'Submission checklist completed', completed: false }
  ];

  const summary = `${project.title} is a ${project.projectType} for ${project.course}. The plan balances research, production, and final review so the team can submit confidently before ${project.dueDate}.`;

  return {
    summary,
    milestones,
    tasks,
    meetings,
    checklistItems,
  };
}

module.exports = {
  generateFallbackPlan,
};
