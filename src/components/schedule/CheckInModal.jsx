import React, { useState } from 'react';
import { Star, CheckCircle2, Clock, AlignLeft } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import useSchedule from '../../hooks/useSchedule';
import useUiStore from '../../store/uiStore';

export const CheckInModal = ({ isOpen, onClose, session }) => {
  const { checkInSession } = useSchedule();
  const { addNotification } = useUiStore();
  const [actualDuration, setActualDuration] = useState(session?.duration || 60);
  const [focusRating, setFocusRating] = useState(4);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!session) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const checkInData = {
      actualDuration: parseInt(actualDuration, 10),
      focusRating,
      notes: notes.trim()
    };

    const success = await checkInSession(session.id, checkInData);
    setLoading(false);
    
    if (success) {
      const focusComments = [
        'Hãy tiếp tục cố gắng ở các phiên sau nhé!',
        'Hơi xao nhãng một chút, nhưng việc bạn hoàn thành vẫn rất đáng ghi nhận!',
        'Tập trung tốt, bạn đang xây dựng thói quen kiên trì rất tốt!',
        'Làm việc xuất sắc! Phiên học vô cùng hiệu quả!',
        'Trạng thái tập trung tuyệt vời! Bạn đã hoàn thành xuất sắc mục tiêu!'
      ];
      const comment = focusComments[focusRating - 1] || 'Phiên học tuyệt vời!';
      
      addNotification(
        `Đã hoàn thành: "${session.title}" (${actualDuration} phút). ${comment}`,
        'success'
      );

      onClose();
    }
  };

  const starDescriptions = [
    'Rất xao nhãng (Gặp khó khăn lớn để tập trung)',
    'Tập trung kém (Bị điện thoại/mạng xã hội làm gián đoạn)',
    'Tập trung vừa phải (Hoàn thành được một phần công việc)',
    'Tập trung tốt (Học tập hiệu quả & đầu óc tỉnh táo)',
    'Trạng thái cực đỉnh (Tập trung tuyệt đối, giải quyết nhanh gọn!)'
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Báo cáo Hoàn thành Phiên học`}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Hủy bỏ
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleSave} 
            loading={loading}
            icon={CheckCircle2}
          >
            Lưu hoàn thành
          </Button>
        </>
      }
    >
      <form onSubmit={handleSave} className="d-flex flex-column gap-3 text-secondary">
        {/* Info Header */}
        <div className="p-3 rounded bg-light border border-light d-flex flex-column gap-0.5">
          <small className="text-muted text-uppercase tracking-wider font-weight-bold" style={{ fontSize: '9px' }}>Ghi nhận hoạt động cho</small>
          <h5 className="font-weight-bold text-dark mb-0 leading-tight" style={{ fontSize: '13px' }}>{session.title}</h5>
          <small className="text-muted" style={{ fontSize: '11px' }}>Lịch dự kiến: {session.startTime} ({session.duration} phút)</small>
        </div>

        {/* Actual Duration Input */}
        <div className="form-group">
          <label htmlFor="actualDuration" className="form-label d-flex align-items-center gap-1.5 font-weight-bold text-dark text-xs mb-1">
            <Clock size={13} className="text-primary" />
            Thời gian học thực tế (Phút)
          </label>
          <div className="input-group">
            <input
              id="actualDuration"
              type="number"
              min="1"
              max="480"
              value={actualDuration}
              onChange={(e) => setActualDuration(e.target.value)}
              className="form-control"
              required
            />
            <span className="input-group-text bg-light text-muted" style={{ fontSize: '12px' }}>phút</span>
          </div>
        </div>

        {/* Focus Level Rating */}
        <div className="form-group">
          <label className="form-label d-flex align-items-center gap-1.5 font-weight-bold text-dark text-xs mb-1">
            <Star size={13} className="text-warning fill-warning" />
            Đánh giá mức độ tập trung
          </label>
          
          <div className="d-flex align-items-center gap-2 py-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFocusRating(star)}
                className="btn btn-link p-0 text-muted hover:text-warning border-0 cursor-pointer"
              >
                <Star
                  size={24}
                  className={`
                    transition-colors
                    ${star <= focusRating ? 'text-warning fill-warning' : 'text-light-subtle'}
                  `}
                />
              </button>
            ))}
          </div>
          
          <small className="text-primary font-weight-bold italic mt-1" style={{ fontSize: '11px' }}>
            {starDescriptions[focusRating - 1]}
          </small>
        </div>

        {/* Study Notes */}
        <div className="form-group">
          <label htmlFor="checkinNotes" className="form-label d-flex align-items-center gap-1.5 font-weight-bold text-dark text-xs mb-1">
            <AlignLeft size={13} className="text-primary" />
            Ghi chú học tập & Tự phản hồi
          </label>
          <textarea
            id="checkinNotes"
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Bạn đã tiếp thu được những gì? Có gặp vướng mắc hay có kiến thức quan trọng nào cần lưu ý ôn tập lại sau không?"
            className="form-control"
            style={{ fontSize: '12px' }}
          />
        </div>
      </form>
    </Modal>
  );
};

export default CheckInModal;
