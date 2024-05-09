import { useState, useEffect } from 'react';
import { TableContainer, Table, TableRow,TableCell,TableBody,
  Typography,
  TableHead,
  Box,
  useTheme,
  InputLabel,
  Input,
  Button,
  Card,
  MenuItem,
  IconButton,
  Chip,
} from '@mui/material';
import PageContainer from '@src/components/container/PageContainer';
import Breadcrumb from '@src/layouts/full/shared/breadcrumb/Breadcrumb';
import DashboardCard from '@src/components/shared/DashboardCard';
import dynamic from "next/dynamic";
import CustomSelect from '@src/components/forms/theme-elements/CustomSelect';
import Link from 'next/link';
import { AppDispatch, useDispatch } from '@src/store/Store';
import { fetchNotices } from '@src/store/apps/NoticeSlice';
import { Row } from 'antd';
import { useRouter } from 'next/router';
const axios = require('axios');
import { API_URL } from '@pages/constant';
import axiosPost from '@pages/axiosWrapper';


interface SelectedFile {
  file: File;
  id: string;
}

const ReactQuill: any = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    return ({ ...props }) => <RQ {...props} />;
  },
  {
    ssr: false,
  }
);
const BCrumb = [
  {
    to: '/noticelist',
    title: '공지사항',
  },
  {
    title: '글작성',
  },
];

export default function QuillEditor() {
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(0);
  const [name, setName] = useState('');

  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const dispatch: AppDispatch = useDispatch(); 
  const [projects, setProjects] = useState([])

  const fetchData = async() => {
    const response = await axiosPost(`${API_URL}/project/List`,{});
    console.log(response.data)
    setProjects(response.data)
  }

  useEffect(() => {
    // 프로젝트 목록 가져오기
    fetchData();
    
    const str = sessionStorage.getItem('user')
    setName(JSON.parse(str).name)
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedFile({
        file: file,
        id: Math.random().toString(36).substr(2, 9), // 각 파일에 고유한 ID 할당
      });
    }
  };

  const handleDelete = () => {
    setSelectedFile(null);
  };

   
  const handleSave = () => {
    const formData = new FormData();
    if (selectedFile) 
      formData.append('file', selectedFile.file);
    else formData.append('file', '');
    formData.append('project_id', category.toString());
    formData.append('title', title);
    formData.append('content', content);
    formData.append('create_by', name);
  
    fetch(`${API_URL}/notice/Register`, {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(() => {
        dispatch(fetchNotices());
        setContent('');
        setTitle('');
        setSelectedFile(null);
        router.back();
      })
      .catch(error => {
        console.error("Failed to register the notice:", error);
      });
  };

  return (
    <PageContainer>
      <Breadcrumb title="글 작성" items={BCrumb} />
      <DashboardCard
        title="글 작성"
        action={
          <Box>
            <Button variant="contained" onClick={handleSave} sx={{ mr: 1 }}>
              저장
            </Button>
          </Box>
        }
      >
        <>
          <Card sx={{ p: 0, border: 1, borderColor: 'black' }} variant={'outlined'}>
            <TableContainer sx={{ borderColor: 'black' }}>
              <Table
                aria-label="simple table"
                sx={{
                  whiteSpace: 'nowrap',
                  borderColor: 'black'
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: "primary.light", borderColor: 'black' }}>
                      <Typography color={'dark'} variant="h6">제목</Typography>
                    </TableCell>
                    <TableCell width={'100%'} sx={{ borderColor: 'black' }} colSpan={7}>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: "primary.light", borderColor: 'black' }}>
                      <Typography variant="h6">분류</Typography>
                    </TableCell>
                    <TableCell sx={{ borderColor: 'black' }}>
                      <CustomSelect
                        labelId="project-select-label"
                        id="project-select"
                        size="small"
                        value={category}
                        sx={{ width: 200, mr: 1 }}
                        onChange={(e: any) => setCategory(e.target.value)}
                      > 
                        <MenuItem value={0}>
                          전체
                        </MenuItem>
                        {projects.map((project: any) => (
                          <MenuItem key={project.id} value={project.id}>
                            {project.name}
                          </MenuItem>
                        ))}
                      </CustomSelect>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: "primary.light", borderColor: 'black' }}>
                      <Typography color={'dark'} variant="h6">첨부파일</Typography>
                    </TableCell>
                    <TableCell>
                      <Row align={'middle'}>
                      <InputLabel  htmlFor="file-upload" style={{ textAlign:'center', width:80, borderBottom: '1px solid black' }} component="label">
                        파일 선택
                      </InputLabel>
                      <Input
                        id="file-upload"
                        type="file"
                        onChange={handleFileChange}
                        inputProps={{
                          'aria-label': '첨부파일',
                        }}
                        style={{ display: 'none' }}
                      />
                      {selectedFile && (
                        <Chip
                          style={{ marginLeft: 2 }}
                          label={selectedFile.file.name}
                          onDelete={handleDelete}
                        />
                      )}
                      </Row>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={2}>
                        <ReactQuill
                          value={content}
                          onChange={setContent}
                          modules={{
                            toolbar: [
                              [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                              [{size: []}],
                              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                              [{'list': 'ordered'}, {'list': 'bullet'}, 
                              {'indent': '-1'}, {'indent': '+1'}],
                              ['link', 'image'],
                              ['clean']
                            ],
                            clipboard: { 
                              matchVisual: false,
                            }
                          }}
                          placeholder="Type here..."
                        /> 
                       
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginY: 2 }}>
            <Button component={Link} href="/noticelist" variant="contained" onClick={() => { }} sx={{ mr: 1 }}>
              목록
            </Button>
          </Box>
        </>
      </DashboardCard>
    </PageContainer>
  );
};
