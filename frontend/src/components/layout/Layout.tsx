import React, { useState } from 'react';
import { Layout as AntLayout, Menu, Button, theme, Dropdown, Space } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import logoImage from '../../assets/logo.svg';

const { Header, Sider, Content, Footer } = AntLayout;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 自定义主题配置
  const { token } = theme.useToken();
  const customToken = {
    ...token,
    colorPrimary: '#000000',
    colorText: '#000000',
    colorBgContainer: '#ffffff',
    colorBorder: '#d9d9d9',
  };

  // 处理登出
  const handleLogout = () => {
    // 清除本地存储的token
    localStorage.removeItem('token');
    // 重定向到登录页面
    navigate('/login');
  };

  // 设置下拉菜单项
  const items = [
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        style={{
          borderRight: '1px solid #d9d9d9',
        }}
      >
        <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
          <img src={logoImage} alt="Venue Booking System Logo" style={{ height: '100%' }} />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={[
            {
              key: '/venues',
              label: 'Venue Management',
            },
            {
              key: '/bookings',
              label: 'Booking Management',
            },
          ]}
        />
      </Sider>
      <AntLayout>
        <Header
          style={{
            padding: 0,
            background: customToken.colorBgContainer,
            borderBottom: '1px solid #d9d9d9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
              Venue Booking Management System
            </span>
          </div>
          <div style={{ marginRight: '24px' }}>
            <Dropdown menu={{ items }} placement="bottomRight">
              <Button
                type="text"
                icon={<SettingOutlined style={{ fontSize: '18px' }} />}
                style={{
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  padding: '4px 8px',
                }}
              />
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: customToken.colorBgContainer,
          }}
        >
          {children}
        </Content>
        <Footer style={{ textAlign: 'center', background: 'transparent' }}>
          Venue Booking Management System ©{new Date().getFullYear()}
        </Footer>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
