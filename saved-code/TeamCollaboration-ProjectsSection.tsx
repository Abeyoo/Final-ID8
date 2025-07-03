// SAVED CODE - Projects Section from TeamCollaboration.tsx
// This code was removed on 2025-07-03 per user request but saved for future reference

// Projects data and UI code that was part of TeamCollaboration component:

const projects = [
  {
    id: 1,
    title: 'Solar Panel Efficiency Study',
    team: 'Science Fair Team',
    tasks: [
      { title: 'Research current technologies', completed: true, assignee: 'John' },
      { title: 'Build test apparatus', completed: true, assignee: 'Sarah' },
      { title: 'Collect data samples', completed: false, assignee: 'Mike' },
      { title: 'Analyze results', completed: false, assignee: 'Lisa' },
      { title: 'Prepare presentation', completed: false, assignee: 'John' },
    ],
    deadline: '2024-05-15',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Romeo and Juliet Production',
    team: 'Drama Club Production',
    tasks: [
      { title: 'Cast selection', completed: true, assignee: 'Director' },
      { title: 'Set design', completed: true, assignee: 'Art Team' },
      { title: 'Rehearsal scheduling', completed: false, assignee: 'John' },
      { title: 'Costume preparation', completed: false, assignee: 'Costume Team' },
      { title: 'Lighting setup', completed: false, assignee: 'Tech Team' },
    ],
    deadline: '2024-06-20',
    priority: 'medium'
  }
];

// Projects tab UI component:
{activeTab === 'projects' && (
  <div className="space-y-6">
    {projects.map((project) => (
      <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
            <div className="flex items-center space-x-3">
              <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {project.team}
              </span>
              <span className={`text-sm px-2 py-1 rounded ${
                project.priority === 'high' ? 'bg-red-100 text-red-600' : 
                project.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 
                'bg-green-100 text-green-600'
              }`}>
                {project.priority} priority
              </span>
            </div>
          </div>
          <div className="flex items-center text-gray-500">
            <Calendar size={16} className="mr-1" />
            <span className="text-sm">Due {new Date(project.deadline).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Tasks</h4>
          {project.tasks.map((task, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <button className="hover:scale-110 transition-transform">
                <CheckCircle
                  size={16}
                  className={task.completed ? 'text-green-500' : 'text-gray-300 hover:text-gray-400'}
                />
              </button>
              <span className={`flex-1 text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                {task.title}
              </span>
              <span className="text-xs text-gray-500">{task.assignee}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Progress: {project.tasks.filter(t => t.completed).length}/{project.tasks.length} tasks
            </span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors">
                View Details
              </button>
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
)}

// Additional state variables related to projects:
const [activeTab, setActiveTab] = useState<'teams' | 'projects'>('teams');

// Tab button for projects:
<button
  onClick={() => setActiveTab('projects')}
  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
    activeTab === 'projects'
      ? 'bg-white text-gray-900 shadow-sm'
      : 'text-gray-600 hover:text-gray-900'
  }`}
>
  Projects
</button>