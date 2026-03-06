import React from 'react';

const Sidebar = ({ activeView, onViewChange }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'journey', label: 'My Journey', icon: '🛣️' },
        { id: 'courses', label: 'Courses', icon: '📚' },
        { id: 'progress', label: 'My Progress', icon: '📈' },
        { id: 'models', label: 'Models', icon: '🤖' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo" style={{ marginBottom: '40px', fontSize: '20px', fontWeight: 'bold', color: 'var(--neon-cyan)' }}>
                <span style={{ marginRight: '10px' }}>🎓</span> ELEARN ML
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        className={`sidebar-item ${activeView === item.id ? 'active' : ''}`}
                        onClick={() => onViewChange(item.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px 15px',
                            marginBottom: '8px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: activeView === item.id ? 'var(--neon-cyan)' : 'var(--text-secondary)',
                            background: activeView === item.id ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
                            transition: 'all 0.3s ease',
                            borderLeft: activeView === item.id ? '3px solid var(--neon-cyan)' : '3px solid transparent'
                        }}
                    >
                        <span style={{ marginRight: '15px', fontSize: '18px' }}>{item.icon}</span>
                        <span style={{ fontWeight: activeView === item.id ? '600' : '400' }}>{item.label}</span>
                    </div>
                ))}
            </nav>

            <div className="sidebar-footer" style={{ marginTop: 'auto', padding: '20px 0', borderTop: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--neon-blue)', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>👤</div>
                    <div style={{ fontSize: '14px' }}>
                        <p style={{ fontWeight: '600' }}>User Profile</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Level 12 Scholar</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
