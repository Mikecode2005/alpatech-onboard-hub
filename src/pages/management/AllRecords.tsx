import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Search, FileDown, Filter } from 'lucide-react';
import PDFExport from '@/components/PDFExport';
import { generateTraineeRecordPDF, TraineeRecord } from '@/lib/pdf-service';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

interface TraineeData extends TraineeRecord {
  status: 'active' | 'completed' | 'pending';
}

const AllRecords: React.FC = () => {
  const navigate = useNavigate();
  const [trainees, setTrainees] = useState<TraineeData[]>([]);
  const [filteredTrainees, setFilteredTrainees] = useState<TraineeData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchTrainees = async () => {
      setIsLoading(true);
      try {
        // Mock data for demonstration
        const mockTrainees: TraineeData[] = [
          {
            id: '001',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+234 123 456 7890',
            completedForms: ['Welcome Policy', 'Course Registration', 'Medical Screening'],
            trainingSet: 'Offshore Group A',
            registrationDate: '2025-08-20',
            status: 'active',
            verificationStatus: 'verified',
            verificationMethod: 'National ID',
            verificationDate: '2025-08-21',
          },
          {
            id: '002',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '+234 987 654 3210',
            completedForms: ['Welcome Policy', 'Course Registration', 'Medical Screening', 'BOSIET'],
            trainingSet: 'Offshore Group A',
            registrationDate: '2025-08-19',
            status: 'completed',
            verificationStatus: 'verified',
            verificationMethod: 'Driver\'s License',
            verificationDate: '2025-08-20',
            isOIM: true,
          },
          {
            id: '003',
            name: 'Michael Johnson',
            email: 'michael.johnson@example.com',
            phone: '+234 555 123 4567',
            completedForms: ['Welcome Policy'],
            trainingSet: 'Onshore Group B',
            registrationDate: '2025-08-22',
            status: 'pending',
            verificationStatus: 'pending',
            verificationMethod: 'Work ID',
            verificationDate: '2025-08-22',
          },
        ];
        
        setTrainees(mockTrainees);
        setFilteredTrainees(mockTrainees);
      } catch (error) {
        console.error('Error fetching trainees:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrainees();
  }, []);

  useEffect(() => {
    // Filter trainees based on search term and active tab
    const filtered = trainees.filter(trainee => {
      const matchesSearch = 
        trainee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (trainee.trainingSet && trainee.trainingSet.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (!matchesSearch) return false;
      
      if (activeTab === 'all') return true;
      return trainee.status === activeTab;
    });
    
    setFilteredTrainees(filtered);
  }, [searchTerm, activeTab, trainees]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleViewTrainee = (traineeId: string) => {
    // Navigate to trainee details page
    navigate(`/management/trainees/${traineeId}`);
  };

  const generateSingleTraineePDF = async (trainee: TraineeData): Promise<jsPDF> => {
    return generateTraineeRecordPDF(trainee);
  };

  const generateAllTraineesPDF = async (): Promise<jsPDF> => {
    // Create a new PDF document
    const doc = new jsPDF();
    let pageHeight = doc.internal.pageSize.height;
    let y = 20;
    
    // Add title
    doc.setFontSize(16);
    doc.text('Alpatech Onboard Hub - All Trainee Records', 15, y);
    y += 10;
    
    // Add generation date
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 15, y);
    y += 10;
    
    // Add table header
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 128); // Navy blue
    doc.text('ID', 15, y);
    doc.text('Name', 35, y);
    doc.text('Training Set', 100, y);
    doc.text('Status', 150, y);
    doc.text('Forms', 180, y);
    y += 7;
    
    // Add a line
    doc.setDrawColor(200, 200, 200);
    doc.line(15, y, 195, y);
    y += 7;
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    // Add table rows
    filteredTrainees.forEach((trainee, index) => {
      // Check if we need a new page
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;
        
        // Add table header on new page
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 128);
        doc.text('ID', 15, y);
        doc.text('Name', 35, y);
        doc.text('Training Set', 100, y);
        doc.text('Status', 150, y);
        doc.text('Forms', 180, y);
        y += 7;
        
        // Add a line
        doc.setDrawColor(200, 200, 200);
        doc.line(15, y, 195, y);
        y += 7;
        
        // Reset text color
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
      }
      
      // Add row data
      doc.text(trainee.id, 15, y);
      doc.text(trainee.name, 35, y);
      doc.text(trainee.trainingSet || 'Not Assigned', 100, y);
      
      // Set status color
      if (trainee.status === 'completed') {
        doc.setTextColor(0, 128, 0); // Green
      } else if (trainee.status === 'active') {
        doc.setTextColor(0, 0, 255); // Blue
      } else {
        doc.setTextColor(255, 128, 0); // Orange
      }
      
      doc.text(trainee.status.toUpperCase(), 150, y);
      doc.setTextColor(0, 0, 0); // Reset to black
      
      // Add form count
      doc.text(`${trainee.completedForms.length} forms`, 180, y);
      
      y += 7;
      
      // Add a light separator line
      if (index < filteredTrainees.length - 1) {
        doc.setDrawColor(240, 240, 240);
        doc.line(15, y, 195, y);
        y += 3;
      }
    });
    
    return doc;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <>
      <Helmet>
        <title>All Training Records - Alpatech Training Centre</title>
        <meta name="description" content="View comprehensive training records for all trainees" />
      </Helmet>

      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">All Training Records</h1>
              <p className="text-muted-foreground">View comprehensive training records for all trainees</p>
            </div>
            <div className="flex gap-2">
              <PDFExport
                generatePDF={generateAllTraineesPDF}
                filename="alpatech_trainee_records.pdf"
                label="Export All Records"
              />
              <Button onClick={() => navigate("/dashboard")} variant="outline">
                Back to Dashboard
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Trainee Records</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search trainees..."
                      className="pl-8 w-[250px]"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab}>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : filteredTrainees.length > 0 ? (
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Training Set</TableHead>
                            <TableHead>Forms Completed</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTrainees.map((trainee) => (
                            <TableRow key={trainee.id}>
                              <TableCell className="font-medium">{trainee.id}</TableCell>
                              <TableCell>
                                {trainee.name}
                                {trainee.isOIM && (
                                  <Badge variant="outline" className="ml-2 bg-amber-100">
                                    OIM
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>{trainee.email}</TableCell>
                              <TableCell>{trainee.trainingSet || 'Not Assigned'}</TableCell>
                              <TableCell>{trainee.completedForms.length}</TableCell>
                              <TableCell>
                                <Badge variant={getStatusBadgeVariant(trainee.status)}>
                                  {trainee.status.toUpperCase()}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewTrainee(trainee.id)}
                                  >
                                    View
                                  </Button>
                                  <PDFExport
                                    generatePDF={() => generateSingleTraineePDF(trainee)}
                                    filename={`trainee_${trainee.id}_record.pdf`}
                                    label=""
                                    variant="outline"
                                    size="sm"
                                    showPreview={false}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No trainees found matching your search criteria.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AllRecords;