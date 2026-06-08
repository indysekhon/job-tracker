import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getApplications, updateStatus } from '../../services/api';
import ApplicationCard from './ApplicationCard';
import ApplicationModal from '../Applications/ApplicationModal';
import './KanbanBoard.css';

const columns = [
  { id: 'wishlist', title: '📝 Wishlist', color: '#95a5a6' },
  { id: 'applied', title: '📤 Applied', color: '#3498db' },
  { id: 'interview', title: '💬 Interview', color: '#f39c12' },
  { id: 'offer', title: '🎉 Offer', color: '#27ae60' },
  { id: 'rejected', title: '❌ Rejected', color: '#e74c3c' },
];

const KanbanBoard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await getApplications();
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
    setLoading(false);
  };

  const getColumnApplications = (status) => {
    return applications.filter(app => app.status === status);
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const appId = parseInt(draggableId);
    const newStatus = destination.droppableId;

    // Optimistic update
    setApplications(prev =>
      prev.map(app =>
        app.id === appId ? { ...app, status: newStatus } : app
      )
    );

    try {
      await updateStatus(appId, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
      fetchApplications(); // Revert on error
    }
  };

  const handleCardClick = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedApp(null);
  };

  const handleSave = () => {
    fetchApplications();
    handleModalClose();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="kanban-container">
      <div className="kanban-header">
        <h1>Kanban Board</h1>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          + Add Application
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          {columns.map(column => (
            <div key={column.id} className="kanban-column">
              <div 
                className="column-header"
                style={{ borderBottomColor: column.color }}
              >
                <h3>{column.title}</h3>
                <span className="count">{getColumnApplications(column.id).length}</span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    className={`column-content ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {getColumnApplications(column.id).map((app, index) => (
                      <Draggable
                        key={app.id}
                        draggableId={app.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <ApplicationCard
                              application={app}
                              isDragging={snapshot.isDragging}
                              onClick={() => handleCardClick(app)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {showModal && (
        <ApplicationModal
          application={selectedApp}
          onClose={handleModalClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default KanbanBoard;