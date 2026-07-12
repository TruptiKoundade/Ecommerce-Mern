const variants = {
  error: 'bg-red-50 text-red-700 border-red-200',
  success: 'bg-green-50 text-green-700 border-green-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
};

const Message = ({ type = 'info', children }) => (
  <div className={`border rounded-md px-4 py-3 text-sm ${variants[type]}`}>{children}</div>
);

export default Message;
