import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Layout, Table, Button, Modal, Form, Input, InputNumber, Popconfirm, message, Select, Switch, Space } from 'antd';
import axios from 'axios';

const root = document.getElementById('root');
if (!root) {
  throw new Error('No root element found to mount the app');
}

const { Header, Content } = Layout;

const API_URL = 'http://127.0.0.1:5004/demo-project/europe-west3/api/v1/games';

enum GameType {
  BaseGame = 'BaseGame',
  Expansion = 'Expansion',
}

interface Game {
  id: number;
  name: string;
  releaseYear: number;
  players?: {
    min: number;
    max: number;
  };
  publisher: string;
  expansions?: number[];
  standalone?: boolean;
  type?: GameType;
  baseGame?: number;
}

const App: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [form] = Form.useForm();
  
  const fetchGames = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      console.log('API Response:', response.data);
      
      const responseData = Array.isArray(response.data) 
        ? response.data 
        : (response.data.data || response.data.games || response.data.items || []);
      
      console.log('Processed data:', responseData);
      
      const processedGames = responseData.map((game: any) => {
        const gameProps = game.props || game;
        
        let players;
        if (gameProps.players) {
          players = {
            min: gameProps.players.min || 1,
            max: gameProps.players.max 
          };
        } else {
          players = { min: 1, max: 4 }; 
        }
        
        const processedGame: Game = {
          id: game._id || game.id,
          name: gameProps.name || '',
          releaseYear: gameProps.releaseYear || 2000,
          publisher: gameProps.publisher || '',
          players: players,
          expansions: gameProps.expansions || [],
          type: gameProps.type || GameType.BaseGame,
          standalone: gameProps.standalone || false,
          baseGame: gameProps.baseGame
        };
        
        console.log('Processed game:', processedGame);
        return processedGame;
      });
      
      setGames(processedGames);
    } catch (error) {
      console.error('Error fetching games:', error);
      message.error('Failed to fetch games');
      
      setGames([
        {
          id: 1,
          name: 'Test Game 1',
          releaseYear: 2020,
          publisher: 'Test Publisher',
          players: { min: 2, max: 4 },
          type: GameType.BaseGame
        },
        {
          id: 2,
          name: 'Test Game 2',
          releaseYear: 2021,
          publisher: 'Another Publisher',
          players: { min: 1, max: 6 },
          type: GameType.Expansion,
          baseGame: 1
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchGames();
  }, []);
  
  const createGame = async (values: Omit<Game, 'id'>) => {
    try {
      const dataToSend = {
        ...values,
        expansions: values.expansions ? values.expansions.map(Number) : []
      };
      
      console.log('Sending create data:', dataToSend);
      const response = await axios.post(API_URL, dataToSend);
      console.log('Create response:', response.data);
      message.success('Game created successfully');
      setModalVisible(false);
      form.resetFields();
      fetchGames();
    } catch (error) {
      console.error('Error creating game:', error);
      message.error('Failed to create game');
    }
  };
  
  const updateGame = async (values: Game) => {
    try {
      const dataToSend = {
        ...values,
        expansions: values.expansions ? values.expansions.map(Number) : []
      };
      
      console.log('Sending update data:', dataToSend);
      const response = await axios.put(`${API_URL}/${editingGame?.id}`, dataToSend);
      console.log('Update response:', response.data);
      message.success('Game updated successfully');
      setModalVisible(false);
      setEditingGame(null);
      form.resetFields();
      fetchGames();
    } catch (error) {
      console.error('Error updating game:', error);
      message.error('Failed to update game');
    }
  };
  
  const deleteGame = async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      console.log('Delete response:', response.data);
      message.success('Game deleted successfully');
      fetchGames();
    } catch (error) {
      console.error('Error deleting game:', error);
      message.error('Failed to delete game');
    }
  };
  
  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        if (editingGame) {
          updateGame({ ...values, id: editingGame.id });
        } else {
          createGame(values);
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };
  
  const handleEdit = (record: Game) => {
    console.log('Editing game:', record);
    
    const players = {
      min: record.players?.min || 1,
      max: record.players?.max || 4
    };
    
    setEditingGame(record);
    form.setFieldsValue({
      ...record,
      players: players,
      expansions: record.expansions || [],
      type: record.type || GameType.BaseGame
    });
    setModalVisible(true);
  };
  
  const handleCreate = () => {
    setEditingGame(null);
    form.resetFields();
    form.setFieldsValue({
      type: GameType.BaseGame,
      expansions: [],
      players: { min: 1, max: 4 }
    });
    setModalVisible(true);
  };
  
  const columns = [
    { 
      title: 'Name', 
      key: 'name',
      render: (_: any, record: Game) => record.name || 'N/A'
    },
    { 
      title: 'Year', 
      key: 'releaseYear',
      render: (_: any, record: Game) => record.releaseYear || 'N/A'
    },
    { 
      title: 'Publisher', 
      key: 'publisher',
      render: (_: any, record: Game) => record.publisher || 'N/A'
    },
    { 
      title: 'Players', 
      key: 'players',
      render: (_: any, record: Game) => {
        if (!record.players) return 'N/A';
        
        if (record.players.min && !record.players.max) {
          return <span>{record.players.min}</span>;
        }
        
        return <span>{record.players.min} - {record.players.max}</span>;
      }
    },
    { 
      title: 'Type', 
      key: 'type',
      render: (_: any, record: Game) => (
        <span>
          {record.type === GameType.BaseGame ? 'Base Game' : 
           record.type === GameType.Expansion ? 'Expansion' : 'N/A'}
        </span>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Game) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete this game?"
            onConfirm={() => deleteGame(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];
  
  return (
    <Layout>
      <Header style={{ color: 'white', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>Games Admin</div>
        <Button type="primary" onClick={handleCreate}>Add Game</Button>
      </Header>
      <Content style={{ padding: '20px' }}>
        <Table 
          dataSource={games.map(game => ({ ...game, key: game.id }))} 
          columns={columns} 
          loading={loading}
          rowKey="id"
        />
        
        <Modal
          title={editingGame ? 'Edit Game' : 'Add New Game'}
          open={modalVisible}
          onOk={handleSubmit}
          onCancel={() => setModalVisible(false)}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            name="gameForm"
            initialValues={{
              players: { min: 1, max: 4 },
              expansions: [],
              type: GameType.BaseGame,
              standalone: false
            }}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter game name!' }]}
            >
              <Input />
            </Form.Item>
            
            <Form.Item
              name="releaseYear"
              label="Release Year"
              rules={[{ required: true, message: 'Please enter release year!' }]}
            >
              <InputNumber min={1950} max={2100} style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item
              name="publisher"
              label="Publisher"
              rules={[{ required: true, message: 'Please enter publisher name!' }]}
            >
              <Input />
            </Form.Item>
            
            <Form.Item label="Players">
              <Space>
                <Form.Item
                  name={['players', 'min']}
                  noStyle
                  rules={[{ required: true, message: 'Minimum players required' }]}
                >
                  <InputNumber min={1} placeholder="Min" />
                </Form.Item>
                <span> to </span>
                <Form.Item
                  name={['players', 'max']}
                  noStyle
                  rules={[{ required: true, message: 'Maximum players required' }]}
                >
                  <InputNumber min={1} placeholder="Max" />
                </Form.Item>
              </Space>
            </Form.Item>
            
            <Form.Item
              name="type"
              label="Game Type"
              rules={[{ required: true, message: 'Please select game type!' }]}
            >
              <Select>
                <Select.Option value={GameType.BaseGame}>Base Game</Select.Option>
                <Select.Option value={GameType.Expansion}>Expansion</Select.Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
            >
              {({ getFieldValue }) => 
                getFieldValue('type') === GameType.Expansion ? (
                  <Form.Item
                    name="baseGame"
                    label="Base Game ID"
                    rules={[{ required: true, message: 'Please enter base game ID!' }]}
                  >
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                ) : null
              }
            </Form.Item>
            
            <Form.Item
              name="standalone"
              label="Standalone"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            
            <Form.Item
              name="expansions"
              label="Expansions (IDs)"
              tooltip="Enter IDs of expansion games separated by commas"
            >
              <Select mode="tags" style={{ width: '100%' }} 
                tokenSeparators={[',']} 
                onChange={(values) => {
                  const numValues = values.map((val: any) => parseInt(val)).filter((val: number) => !isNaN(val));
                  form.setFieldsValue({ expansions: numValues });
                }}
              />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
