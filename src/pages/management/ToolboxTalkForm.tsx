import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/state/userContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Users, Search, Plus, Trash2, ArrowLeft, Save, Printer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const ToolboxTalkForm = () => {
  const { formId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("checklist");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(null);
  const [checklistItems, setChecklistItems] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [selectedTrainees, setSelectedTrainees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddTraineeDialogOpen, setIsAddTraineeDialogOpen] = useState(false);
  const [availableTrainees, setAvailableTrainees] = useState([]);
  const [selectedTraineeId, setSelectedTraineeId] = useState("");
  const [responses, setResponses] = useState({});
  const [sessionId, setSessionId] = useState(null);
  const [sessionData, setSessionData] = useState({
    date: new Date(),
    location: "",
    notes: ""
  });

  useEffect(() => {
    if (formId) {
      fetchFormData();
      fetchAvailableTrainees();
    }
  }, [formId]);

  const fetchFormData = async () => {
    setLoading(true);
    try {
      // Fetch form data
      const { data: formData, error: formError } = await supabase
        .from('toolbox_talk_forms')
        .select(`
          id,
          title,
          form_type,
          created_at,
          created_by,
          users(email, name)
        `)
        .eq('id', formId)
        .single();
      
      if (formError) throw formError;
      
      // Fetch checklist items
      const { data: checklistData, error: checklistError } = await supabase
        .from('toolbox_talk_checklist_items')
        .select('*')
        .eq('form_id', formId)
        .order('item_order', { ascending: true });
      
      if (checklistError) throw checklistError;
      
      // Initialize responses object
      const initialResponses = {};
      checklistData.forEach(item => {
        initialResponses[item.id] = { yes: false, no: false, na: false };
      });
      
      setFormData(formData);
      setChecklistItems(checklistData);
      setResponses(initialResponses);
      
      // Check if there's an active session for this form
      const { data: sessionData, error: sessionError } = await supabase
        .from('toolbox_talk_sessions')
        .select(`
          id,
          session_date,
          location,
          notes,
          toolbox_talk_attendees(
            id,
            trainee_id,
            users(id, email, name)
          )
        `)
        .eq('form_id', formId)
        .eq('instructor_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (sessionError) throw sessionError;
      
      if (sessionData && sessionData.length > 0) {
        const session = sessionData[0];
        setSessionId(session.id);
        setSessionData({
          date: new Date(session.session_date),
          location: session.location,
          notes: session.notes
        });
        
        // Set trainees from attendees
        const attendees = session.toolbox_talk_attendees || [];
        const traineeList = attendees.map(attendee => ({
          id: attendee.trainee_id,
          email: attendee.users?.email || "",
          name: attendee.users?.name || attendee.users?.email || "Unknown"
        }));
        
        setTrainees(traineeList);
        setSelectedTrainees(traineeList.map(t => t.id));
        
        // Fetch responses for this session
        const { data: responseData, error: responseError } = await supabase
          .from('toolbox_talk_checklist_responses')
          .select('*')
          .eq('session_id', session.id);
        
        if (responseError) throw responseError;
        
        if (responseData && responseData.length > 0) {
          const responseObj = {};
          responseData.forEach(response => {
            responseObj[response.checklist_item_id] = {
              yes: response.response === 'yes',
              no: response.response === 'no',
              na: response.response === 'na'
            };
          });
          
          setResponses(responseObj);
        }
      }
    } catch (error) {
      console.error("Error fetching toolbox talk form data:", error);
      toast({
        title: "Error",
        description: "Failed to load toolbox talk form data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTrainees = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, name')
        .eq('role', 'Trainee');
      
      if (error) throw error;
      
      setAvailableTrainees(data || []);
    } catch (error) {
      console.error("Error fetching available trainees:", error);
      toast({
        title: "Error",
        description: "Failed to load trainee data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCreateSession = async () => {
    try {
      if (!sessionData.location) {
        toast({
          title: "Validation Error",
          description: "Please provide a location for the session.",
          variant: "destructive"
        });
        return;
      }
      
      // Create a new session
      const { data, error } = await supabase
        .from('toolbox_talk_sessions')
        .insert({
          form_id: formId,
          instructor_id: user.id,
          session_date: sessionData.date.toISOString(),
          location: sessionData.location,
          notes: sessionData.notes
        })
        .select();
      
      if (error) throw error;
      
      setSessionId(data[0].id);
      
      toast({
        title: "Success",
        description: "Toolbox talk session created successfully.",
      });
    } catch (error) {
      console.error("Error creating toolbox talk session:", error);
      toast({
        title: "Error",
        description: "Failed to create toolbox talk session. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateSession = async () => {
    try {
      if (!sessionId) {
        await handleCreateSession();
        return;
      }
      
      // Update the session
      const { error } = await supabase
        .from('toolbox_talk_sessions')
        .update({
          session_date: sessionData.date.toISOString(),
          location: sessionData.location,
          notes: sessionData.notes
        })
        .eq('id', sessionId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Toolbox talk session updated successfully.",
      });
    } catch (error) {
      console.error("Error updating toolbox talk session:", error);
      toast({
        title: "Error",
        description: "Failed to update toolbox talk session. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddTrainee = async () => {
    try {
      if (!selectedTraineeId) {
        toast({
          title: "Validation Error",
          description: "Please select a trainee to add.",
          variant: "destructive"
        });
        return;
      }
      
      if (!sessionId) {
        await handleCreateSession();
      }
      
      // Add trainee to session
      const { error } = await supabase
        .from('toolbox_talk_attendees')
        .insert({
          session_id: sessionId,
          trainee_id: selectedTraineeId
        });
      
      if (error) throw error;
      
      // Update local state
      const trainee = availableTrainees.find(t => t.id === selectedTraineeId);
      if (trainee) {
        setTrainees([...trainees, trainee]);
        setSelectedTrainees([...selectedTrainees, trainee.id]);
      }
      
      setIsAddTraineeDialogOpen(false);
      setSelectedTraineeId("");
      
      toast({
        title: "Success",
        description: "Trainee added to session successfully.",
      });
    } catch (error) {
      console.error("Error adding trainee to session:", error);
      toast({
        title: "Error",
        description: "Failed to add trainee to session. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveTrainee = async (traineeId) => {
    try {
      if (!sessionId) {
        toast({
          title: "Error",
          description: "No active session found.",
          variant: "destructive"
        });
        return;
      }
      
      // Remove trainee from session
      const { error } = await supabase
        .from('toolbox_talk_attendees')
        .delete()
        .eq('session_id', sessionId)
        .eq('trainee_id', traineeId);
      
      if (error) throw error;
      
      // Update local state
      setTrainees(trainees.filter(t => t.id !== traineeId));
      setSelectedTrainees(selectedTrainees.filter(id => id !== traineeId));
      
      toast({
        title: "Success",
        description: "Trainee removed from session successfully.",
      });
    } catch (error) {
      console.error("Error removing trainee from session:", error);
      toast({
        title: "Error",
        description: "Failed to remove trainee from session. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleResponseChange = (itemId, responseType) => {
    setResponses(prev => ({
      ...prev,
      [itemId]: {
        yes: responseType === 'yes',
        no: responseType === 'no',
        na: responseType === 'na'
      }
    }));
  };

  const handleSaveResponses = async () => {
    try {
      if (!sessionId) {
        await handleCreateSession();
        if (!sessionId) return; // If creation failed
      }
      
      // Prepare responses for saving
      const responsesToSave = [];
      Object.entries(responses).forEach(([itemId, response]) => {
        let responseType = null;
        if (response.yes) responseType = 'yes';
        else if (response.no) responseType = 'no';
        else if (response.na) responseType = 'na';
        
        if (responseType) {
          responsesToSave.push({
            session_id: sessionId,
            checklist_item_id: itemId,
            response: responseType
          });
        }
      });
      
      // Delete existing responses
      const { error: deleteError } = await supabase
        .from('toolbox_talk_checklist_responses')
        .delete()
        .eq('session_id', sessionId);
      
      if (deleteError) throw deleteError;
      
      // Insert new responses
      if (responsesToSave.length > 0) {
        const { error: insertError } = await supabase
          .from('toolbox_talk_checklist_responses')
          .insert(responsesToSave);
        
        if (insertError) throw insertError;
      }
      
      toast({
        title: "Success",
        description: "Responses saved successfully.",
      });
    } catch (error) {
      console.error("Error saving responses:", error);
      toast({
        title: "Error",
        description: "Failed to save responses. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredTrainees = trainees.filter(trainee => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      trainee.name?.toLowerCase().includes(searchTerm) ||
      trainee.email?.toLowerCase().includes(searchTerm)
    );
  });

  const filteredAvailableTrainees = availableTrainees.filter(trainee => {
    return !selectedTrainees.includes(trainee.id);
  });

  return (
    <DashboardLayout>
      <DashboardHeader
        title={loading ? "Loading..." : formData?.title || "Toolbox Talk Form"}
        description={`Form Type: ${formData?.form_type || ""}`}
        icon={<ClipboardList className="h-6 w-6 mr-2" />}
      >
        <Button variant="outline" onClick={() => navigate('/toolbox-talk-dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </DashboardHeader>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <p>Loading toolbox talk form...</p>
        </div>
      ) : (
        <>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Session Information</CardTitle>
              <CardDescription>Manage session details and trainees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={sessionData.location}
                    onChange={(e) => setSessionData({ ...sessionData, location: e.target.value })}
                    placeholder="Enter session location"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={sessionData.notes}
                    onChange={(e) => setSessionData({ ...sessionData, notes: e.target.value })}
                    placeholder="Enter session notes"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={handleUpdateSession}>
                  <Save className="h-4 w-4 mr-2" />
                  {sessionId ? "Update Session" : "Create Session"}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="checklist" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="checklist">Checklist</TabsTrigger>
              <TabsTrigger value="trainees">Trainees</TabsTrigger>
            </TabsList>
            
            <TabsContent value="checklist" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Toolbox Talk Checklist</CardTitle>
                    <CardDescription>Complete the checklist for this toolbox talk</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handlePrint}>
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                    <Button onClick={handleSaveResponses}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Responses
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">No.</TableHead>
                        <TableHead>Checklist Item</TableHead>
                        <TableHead className="w-[80px] text-center">Yes</TableHead>
                        <TableHead className="w-[80px] text-center">No</TableHead>
                        <TableHead className="w-[80px] text-center">N/A</TableHead>
                        <TableHead className="w-[150px]">Remarks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {checklistItems.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.item_text}</TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={responses[item.id]?.yes || false}
                              onCheckedChange={(checked) => {
                                if (checked) handleResponseChange(item.id, 'yes');
                              }}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={responses[item.id]?.no || false}
                              onCheckedChange={(checked) => {
                                if (checked) handleResponseChange(item.id, 'no');
                              }}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={responses[item.id]?.na || false}
                              onCheckedChange={(checked) => {
                                if (checked) handleResponseChange(item.id, 'na');
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Input placeholder="Remarks" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="trainees" className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search trainees..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={() => setIsAddTraineeDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Trainee
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Trainees</CardTitle>
                  <CardDescription>Manage trainees for this toolbox talk session</CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredTrainees.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">No.</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTrainees.map((trainee, index) => (
                          <TableRow key={trainee.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{trainee.name || "N/A"}</TableCell>
                            <TableCell>{trainee.email}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveTrainee(trainee.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Users className="h-12 w-12 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">No trainees found</h3>
                      <p className="text-muted-foreground">
                        {searchQuery ? "Try adjusting your search" : "Add trainees to this session"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Add Trainee Dialog */}
          <Dialog open={isAddTraineeDialogOpen} onOpenChange={setIsAddTraineeDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Trainee</DialogTitle>
                <DialogDescription>
                  Add a trainee to this toolbox talk session.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Select value={selectedTraineeId} onValueChange={setSelectedTraineeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a trainee" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredAvailableTrainees.map((trainee) => (
                      <SelectItem key={trainee.id} value={trainee.id}>
                        {trainee.name || trainee.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddTraineeDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTrainee}>Add Trainee</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </DashboardLayout>
  );
};

export default ToolboxTalkForm;