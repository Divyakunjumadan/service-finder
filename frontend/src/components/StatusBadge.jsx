const STATUS_MAP = {
  pending: { label: 'Pending', cls: 'badge-yellow', icon: '⏳' },
  accepted: { label: 'Accepted', cls: 'badge-green', icon: '✅' },
  rejected: { label: 'Rejected', cls: 'badge-red', icon: '❌' },
  'auto-cancelled': { label: 'Auto-cancelled', cls: 'badge-gray', icon: '🚫' },
  completed: { label: 'Completed', cls: 'badge-blue', icon: '✔️' },
  open: { label: 'Open', cls: 'badge-green', icon: '●' },
  closed: { label: 'Closed', cls: 'badge-red', icon: '●' },
  available: { label: 'Available', cls: 'badge-blue', icon: '✓' },
  busy: { label: 'Busy', cls: 'badge-yellow', icon: '⏳' },
}

const StatusBadge = ({ status }) => {
  const config = STATUS_MAP[status] || { label: status, cls: 'badge-gray', icon: '•' }
  return (
    <span className={`badge ${config.cls}`}>
      {config.icon} {config.label}
    </span>
  )
}

export default StatusBadge
