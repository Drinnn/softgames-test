import React from 'react';
import ReactDOM from 'react-dom/client';
import { Layout, Table } from 'antd';

const root = document.getElementById('root');
if (!root) {
  throw new Error('No root element found to mount the app');
}

const { Header, Content } = Layout;

import data from '../../games.json';
const dataSource = data.map((item) => ({ ...item, key: item.id }));

const tableColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Year', dataIndex: 'releaseYear', key: 'releaseYear' },
  { title: 'Publisher', dataIndex: 'publisher', key: 'publisher' },
]

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Layout>
      <Header style={{ color: 'white', fontSize: '20px' }}>Admin</Header>
      <Content>
        <Table dataSource={dataSource} columns={tableColumns} />
      </Content>
    </Layout>
  </React.StrictMode>,
);
