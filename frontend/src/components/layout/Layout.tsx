import React, { useState } from 'react';
import { Layout as AntLayout, Menu, Button, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

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
        <div style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.2)' }} />
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
          }}
        >
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
