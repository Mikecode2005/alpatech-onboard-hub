import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, FileText, UserCheck, AlertTriangle } from "lucide-react";

interface MedicalRecord {
  id: string;
  trainee_name: string;
  trainee_email: string;
  medical_data: any;
  nurse_remarks?: string;
  status: 'pending_review' | 'approved' | 'requires_manager_review';
  created_at: string;
  updated_at: string;
}

const NurseDashboard = () => {
  const { toast } = useToast();
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [nurseRemarks, setNurseRemarks] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      // This would fetch from medical_records table when implemented
      // For now, showing placeholder data
      setMedicalRecords([
        {
          id: "1",
          trainee_name: "John Doe",
          trainee_email: "john.doe@company.com",
          medical_data: {
            age: "28",
            gender: "Male",
            hasCondition: false,
            medication: "None",
            healthConditionDetails: "No known allergies"
          },
          status: 'pending_review',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "2", 
          trainee_name: "Jane Smith",
          trainee_email: "jane.smith@company.com",
          medical_data: {
            age: "32",
            gender: "Female", 
            hasCondition: true,
            medication: "Asthma inhaler",
            healthConditionDetails: "Mild asthma, requires inhaler during physical activity"
          },
          status: 'pending_review',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    } catch (error) {
      toast({ title: "Error fetching medical records", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const updateMedicalRecord = async (recordId: string, status: MedicalRecord['status'], remarks?: string) => {
    try {
      // Update medical record with nurse remarks and status
      const updatedRecords = medicalRecords.map(record => 
        record.id === recordId 
          ? { ...record, status, nurse_remarks: remarks, updated_at: new Date().toISOString() }
          : record
      );
      setMedicalRecords(updatedRecords);
      
      toast({ 
        title: "Medical record updated successfully",
        description: status === 'approved' ? "Trainee cleared for training" : "Flagged for manager review"
      });
      
      setSelectedRecord(null);
      setNurseRemarks("");
    } catch (error) {
      toast({ title: "Error updating medical record", variant: "destructive" });
    }
  };

  const filteredRecords = medicalRecords.filter(record =>
    record.trainee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.trainee_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: MedicalRecord['status']) => {
    switch (status) {
      case 'pending_review':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pending Review</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Approved</Badge>;
      case 'requires_manager_review':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Manager Review Required</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <Helmet>
        <title>Nurse Dashboard - Medical Records Review | Alpatech</title>
        <meta name="description" content="Review and process trainee medical screening forms" />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Nurse Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search trainees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Medical Records ({filteredRecords.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading medical records...</div>
                ) : filteredRecords.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No medical records found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRecords.map((record) => (
                      <div
                        key={record.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedRecord?.id === record.id ? 'border-primary bg-primary/5' : 'hover:bg-accent/50'
                        }`}
                        onClick={() => setSelectedRecord(record)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{record.trainee_name}</h3>
                            <p className="text-sm text-muted-foreground">{record.trainee_email}</p>
                            <p className="text-xs text-muted-foreground">
                              Submitted: {new Date(record.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {getStatusBadge(record.status)}
                            {record.medical_data.hasCondition && (
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Review Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedRecord ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedRecord.trainee_name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedRecord.trainee_email}</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="font-medium">Age</Label>
                        <p>{selectedRecord.medical_data.age}</p>
                      </div>
                      <div>
                        <Label className="font-medium">Gender</Label>
                        <p>{selectedRecord.medical_data.gender}</p>
                      </div>
                      <div>
                        <Label className="font-medium">Medical Condition</Label>
                        <p>{selectedRecord.medical_data.hasCondition ? 'Yes' : 'No'}</p>
                      </div>
                      {selectedRecord.medical_data.hasCondition && (
                        <>
                          <div>
                            <Label className="font-medium">Medication</Label>
                            <p>{selectedRecord.medical_data.medication || 'None specified'}</p>
                          </div>
                          <div>
                            <Label className="font-medium">Health Condition Details</Label>
                            <p>{selectedRecord.medical_data.healthConditionDetails || 'No details provided'}</p>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label className="font-medium">Nurse Remarks</Label>
                      <Textarea
                        placeholder="Enter your professional assessment and recommendations..."
                        value={nurseRemarks}
                        onChange={(e) => setNurseRemarks(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={() => updateMedicalRecord(selectedRecord.id, 'approved', nurseRemarks)}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Approve for Training
                      </Button>
                      <Button
                        onClick={() => updateMedicalRecord(selectedRecord.id, 'requires_manager_review', nurseRemarks)}
                        variant="destructive"
                        className="w-full"
                      >
                        Flag for Manager Review
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Select a medical record to review
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseDashboard;