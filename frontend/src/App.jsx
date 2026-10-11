import { useState } from 'react';
import SearchBar from './components/SearchBar';
import StatusFilter from './components/StatusFilter';
import TaskTable from './components/TaskTable';
import { useTasks } from './hooks/useTasks';

export default function App() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { tasks, total, loading, error } = useTasks(query, status, page, 10);

  const totalPages = Math.ceil(total / 10);

  // CSV Export Handler function
  const handleExportCSV = () => {
    if (!tasks || tasks.length === 0) return;
    
    const headers = ['ID', 'Title', 'Description', 'Status', 'Priority', 'Assignee', 'Created At'];
    const rows = tasks.map(t => [
      t.id,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.status,
      t.priority || '',
      t.assignee || '',
      t.createdAt || ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'tasks_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Task Tracker</h1>
          <p className="subtitle">Internal task management</p>
        </div>
        <button className="export-btn" onClick={handleExportCSV} disabled={tasks.length === 0}>
          Export CSV 📊
        </button>
      </header>

      <div className="controls">
        <SearchBar value={query} onChange={setQuery} />
        <StatusFilter value={status} onChange={setStatus} />
      </div>

      {/* Task Table */}
      <TaskTable tasks={tasks} loading={loading} error={error} />

      {/* Empty State UI Handling */}
      {!loading && !error && tasks.length === 0 && (
        <div className="empty-state" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <h3>No tasks found 📭</h3>
          <p>Try adjusting your search query or status filter.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}