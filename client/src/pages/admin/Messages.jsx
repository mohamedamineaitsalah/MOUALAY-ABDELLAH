import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { messageService } from '../../services/services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import { FaTrash, FaCheck, FaEnvelopeOpen, FaEnvelope } from 'react-icons/fa';

const MessagesAdmin = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = () => {
    setLoading(true);
    messageService.getAll()
      .then(res => {
        if (res.data.success) setMessages(res.data.data);
      })
      .catch(() => toast.error(t('general.error')))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id, currentStatus) => {
    if (currentStatus) return;
    try {
      await messageService.markAsRead(id);
      fetchMessages();
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, is_read: true });
      }
    } catch (error) {
      toast.error(t('general.error'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('admin.confirmDelete'))) {
      try {
        await messageService.delete(id);
        toast.success('Message deleted successfully');
        if (selectedMessage?.id === id) setSelectedMessage(null);
        fetchMessages();
      } catch (error) {
        toast.error(t('general.error'));
      }
    }
  };

  if (loading && messages.length === 0) return <LoadingSpinner fullScreen />;

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      
      <div className={`w-full ${selectedMessage ? 'hidden md:flex md:w-1/3' : 'flex'} flex-col bg-white rounded-lg shadow overflow-hidden border border-gray-200`}>
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">{t('admin.messages')}</h2>
          <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {messages.filter(m => !m.is_read).length} {t('admin.unread')}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">{t('general.noData')}</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {messages.map(msg => (
                <li 
                  key={msg.id} 
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedMessage?.id === msg.id ? 'bg-primary-50 border-l-4 border-primary-500' : 'border-l-4 border-transparent'} ${!msg.is_read ? 'bg-blue-50/50' : ''}`}
                  onClick={() => { setSelectedMessage(msg); handleMarkAsRead(msg.id, msg.is_read); }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-sm font-medium ${!msg.is_read ? 'text-gray-900 font-bold' : 'text-gray-700'}`}>{msg.name}</h3>
                    <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className={`text-sm truncate ${!msg.is_read ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>{msg.subject}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={`w-full ${!selectedMessage ? 'hidden md:flex md:w-2/3' : 'flex md:w-2/3'} flex-col bg-white rounded-lg shadow border border-gray-200`}>
        {selectedMessage ? (
          <>
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedMessage.subject}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <span className="font-medium text-gray-900">{selectedMessage.name}</span>
                    <span>&lt;{selectedMessage.email}&gt;</span>
                  </div>
                  <p className="text-xs text-gray-500">{new Date(selectedMessage.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedMessage(null)} className="md:hidden text-gray-500 hover:text-gray-700 mr-4 rtl:mr-0 rtl:ml-4">
                    {t('general.back')}
                  </button>
                  <button onClick={() => handleDelete(selectedMessage.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors" title={t('admin.delete')}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="prose max-w-none text-gray-800 whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
            <FaEnvelopeOpen size={64} className="mb-4 text-gray-200" />
            <p className="text-lg">Select a message to read</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesAdmin;
