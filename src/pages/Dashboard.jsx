// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaCheck,
} from 'react-icons/fa';
import { BiSolidRightArrowAlt } from 'react-icons/bi';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await api.get('/api/tasks');
      setTasks(res.data.tasks);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!title.trim()) return;
    try {
      await api.post('/api/tasks', { title });
      toast.success('Task added');
      setTitle('');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to add task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      toast.success('Task deleted');
      fetchTasks();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleNextStatus = async (task) => {
    const statusFlow = ['TO_DO', 'IN_PROGRESS', 'DONE'];
    const currentIndex = statusFlow.indexOf(task.status);
    if (currentIndex < 2) {
      try {
        await api.put(`/api/tasks/${task.id}`, {
          status: statusFlow[currentIndex + 1],
        });
        toast.success('Status updated');
        fetchTasks();
      } catch (error) {
        toast.error('Update failed');
      }
    }
  };

  const handleEditTitle = (taskId, currentTitle) => {
    setEditingTaskId(taskId);
    setEditedTitle(currentTitle);
  };

  const handleSaveEdit = async (id) => {
    try {
      await api.patch(`/api/tasks/${id}`, { title: editedTitle });
      toast.success('Title updated');
      setEditingTaskId(null);
      fetchTasks();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const groupedTasks = {
    TO_DO: [],
    IN_PROGRESS: [],
    DONE: [],
  };

  tasks.forEach((task) => {
    groupedTasks[task.status].push(task);
  });

  const statusLabels = {
    TO_DO: 'To Do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done',
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <div className="flex gap-4 mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add new task..."
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={handleAddTask}
          className="bg-green-600 text-white p-2 rounded flex items-center gap-2"
        >
          <FaPlus /> Add
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {Object.keys(groupedTasks).map((status) => (
          <div key={status}>
            <h3 className="text-xl font-bold mb-2 text-center bg-gray-200 py-1 rounded">
              {statusLabels[status]}
            </h3>
            <div className="space-y-3">
              {groupedTasks[status].map((task) => (
                <div
                  key={task.id}
                  className="bg-white border shadow rounded p-3 flex justify-between items-center"
                >
                  {editingTaskId === task.id ? (
                    <div className="flex-1 mr-2">
                      <input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="w-full border p-1 rounded"
                      />
                    </div>
                  ) : (
                    <span className="flex-1">{task.title}</span>
                  )}

                  <div className="flex gap-2 items-center">
                    {editingTaskId === task.id ? (
                      <button
                        onClick={() => handleSaveEdit(task.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <FaCheck />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditTitle(task.id, task.title)}
                        className="text-yellow-500 hover:text-yellow-600"
                      >
                        <FaEdit />
                      </button>
                    )}

                    {task.status !== 'DONE' && (
                      <button
                        onClick={() => handleNextStatus(task)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <BiSolidRightArrowAlt size={20} />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
