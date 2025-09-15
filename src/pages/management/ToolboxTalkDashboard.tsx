import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/state/userContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, ClipboardList, FilePlus, Search, Trash2, Edit, Plus, Calendar as CalendarIcon2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const ToolboxTalkDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("forms");
  const [loading, setLoading] = useState(true);
  const [toolboxForms, setToolboxForms] = useState([]);
  const [toolboxSessions, setToolboxSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formType, setFormType] = useState("");
  const [isCreateFormDialogOpen, setIsCreateFormDialogOpen] = useState(false);
  const [isCreateSessionDialogOpen, setIsCreateSessionDialogOpen] = useState(false);
  const [newFormData, setNewFormData] = useState({
    title: "",
    formType: "",
    checklistItems: ["", "", ""]
  });
  const [newSessionData, setNewSessionData] = useState({
    formId: "",
    sessionDate: new Date(),
    location: "",
    notes: ""
  });
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    fetchToolboxData();
  }, []);

  const fetchToolboxData = async () => {
    setLoading(true);
    try {
      // Fetch toolbox talk forms
      const { data: formsData, error: formsError } = await supabase
        .from('toolbox_talk_forms')
        .select(`
          id,
          title,
          form_type,
          created_at,
          created_by,
          users(email, name)
        `)
        .order('created_at', { ascending: false });
      
      if (formsError) throw formsError;
      
      // Fetch toolbox talk sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('toolbox_talk_sessions')
        .select(`
          id,
          form_id,
          instructor_id,
          session_date,
          location,
          notes,
          created_at,
          toolbox_talk_forms(title, form_type),
          users(email, name)
        `)
        .order('session_date', { ascending: false });
      
      if (sessionsError) throw sessionsError;
      
      setToolboxForms(formsData);
      setToolboxSessions(sessionsData);
    } catch (error) {
      console.error("Error fetching toolbox talk data:", error);
      toast({
        title: "Error",
        description: "Failed to load toolbox talk data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForm = async () => {
    try {
      if (!newFormData.title || !newFormData.formType || newFormData.checklistItems.some(item => !item)) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }
      
      // Create the form
      const { data: formData, error: formError } = await supabase
        .from('toolbox_talk_forms')
        .insert({
          title: newFormData.title,
          form_type: newFormData.formType,
          created_by: user.id
        })
        .select();
      
      if (formError) throw formError;
      
      // Create checklist items
      const checklistItems = newFormData.checklistItems.map((item, index) => ({
        form_id: formData[0].id,
        item_text: item,
        item_order: index + 1
      }));
      
      const { error: checklistError } = await supabase
        .from('toolbox_talk_checklist_items')
        .insert(checklistItems);
      
      if (checklistError) throw checklistError;
      
      toast({
        title: "Success",
        description: "Toolbox talk form created successfully.",
      });
      
      setIsCreateFormDialogOpen(false);
      setNewFormData({
        title: "",
        formType: "",
        checklistItems: ["", "", ""]
      });
      
      fetchToolboxData();
    } catch (error) {
      console.error("Error creating toolbox talk form:", error);
      toast({
        title: "Error",
        description: "Failed to create toolbox talk form. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCreateSession = async () => {
    try {
      if (!newSessionData.formId || !newSessionData.sessionDate || !newSessionData.location) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('toolbox_talk_sessions')
        .insert({
          form_id: newSessionData.formId,
          instructor_id: user.id,
          session_date: newSessionData.sessionDate.toISOString(),
          location: newSessionData.location,
          notes: newSessionData.notes
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Toolbox talk session created successfully.",
      });
      
      setIsCreateSessionDialogOpen(false);
      setNewSessionData({
        formId: "",
        sessionDate: new Date(),
        location: "",
        notes: ""
      });
      
      fetchToolboxData();
    } catch (error) {
      console.error("Error creating toolbox talk session:", error);
      toast({
        title: "Error",
        description: "Failed to create toolbox talk session. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteForm = async (formId) => {
    try {
      const { error } = await supabase
        .from('toolbox_talk_forms')
        .delete()
        .eq('id', formId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Toolbox talk form deleted successfully.",
      });
      
      fetchToolboxData();
    } catch (error) {
      console.error("Error deleting toolbox talk form:", error);
      toast({
        title: "Error",
        description: "Failed to delete toolbox talk form. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      const { error } = await supabase
        .from('toolbox_talk_sessions')
        .delete()
        .eq('id', sessionId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Toolbox talk session deleted successfully.",
      });
      
      fetchToolboxData();
    } catch (error) {
      console.error("Error deleting toolbox talk session:", error);
      toast({
        title: "Error",
        description: "Failed to delete toolbox talk session. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleViewForm = (form) => {
    setSelectedForm(form);
    navigate(`/toolbox-talk-form/${form.id}`);
  };

  const handleViewSession = (session) => {
    setSelectedSession(session);
    navigate(`/toolbox-talk-session/${session.id}`);
  };

  const handleAddChecklistItem = () => {
    setNewFormData({
      ...newFormData,
      checklistItems: [...newFormData.checklistItems, ""]
    });
  };

  const handleRemoveChecklistItem = (index) => {
    const updatedItems = [...newFormData.checklistItems];
    updatedItems.splice(index, 1);
    setNewFormData({
      ...newFormData,
      checklistItems: updatedItems
    });
  };

  const handleChecklistItemChange = (index, value) => {
    const updatedItems = [...newFormData.checklistItems];
    updatedItems[index] = value;
    setNewFormData({
      ...newFormData,
      checklistItems: updatedItems
    });
  };

  const filteredForms = toolboxForms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = formType ? form.form_type === formType : true;
    return matchesSearch && matchesType;
  });

  const filteredSessions = toolboxSessions.filter(session => {
    return session.toolbox_talk_forms.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Toolbox Talk Dashboard"
        description="Manage toolbox talk forms and sessions"
        icon={<ClipboardList className="h-6 w-6 mr-2" />}
      />
      
      <Tabs defaultValue="forms" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="forms">Toolbox Talk Forms</TabsTrigger>
          <TabsTrigger value="sessions">Toolbox Talk Sessions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="forms" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search forms..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={formType} onValueChange={setFormType}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Form Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="procedure">Procedure</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setIsCreateFormDialogOpen(true)}>
              <FilePlus className="h-4 w-4 mr-2" />
              Create Form
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Toolbox Talk Forms</CardTitle>
              <CardDescription>Manage your toolbox talk forms</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <p>Loading toolbox talk forms...</p>
                </div>
              ) : filteredForms.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredForms.map((form) => (
                      <TableRow key={form.id}>
                        <TableCell className="font-medium">{form.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{form.form_type}</Badge>
                        </TableCell>
                        <TableCell>{form.users?.name || form.users?.email || "Unknown"}</TableCell>
                        <TableCell>{new Date(form.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewForm(form)}>
                              View
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteForm(form.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <ClipboardList className="h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No toolbox talk forms found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || formType ? "Try adjusting your search or filters" : "Create your first toolbox talk form"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sessions" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sessions..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsCreateSessionDialogOpen(true)}>
              <CalendarIcon2 className="h-4 w-4 mr-2" />
              Create Session
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Toolbox Talk Sessions</CardTitle>
              <CardDescription>Manage your toolbox talk sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <p>Loading toolbox talk sessions...</p>
                </div>
              ) : filteredSessions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Form Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">{session.toolbox_talk_forms?.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{session.toolbox_talk_forms?.form_type}</Badge>
                        </TableCell>
                        <TableCell>{new Date(session.session_date).toLocaleDateString()}</TableCell>
                        <TableCell>{session.location}</TableCell>
                        <TableCell>{session.users?.name || session.users?.email || "Unknown"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewSession(session)}>
                              View
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteSession(session.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CalendarIcon2 className="h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No toolbox talk sessions found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? "Try adjusting your search" : "Create your first toolbox talk session"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Create Form Dialog */}
      <Dialog open={isCreateFormDialogOpen} onOpenChange={setIsCreateFormDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Toolbox Talk Form</DialogTitle>
            <DialogDescription>
              Create a new toolbox talk form with checklist items.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newFormData.title}
                onChange={(e) => setNewFormData({ ...newFormData, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="formType" className="text-right">
                Form Type
              </Label>
              <Select
                value={newFormData.formType}
                onValueChange={(value) => setNewFormData({ ...newFormData, formType: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select form type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="procedure">Procedure</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Checklist Items</h4>
                <Button type="button" variant="outline" size="sm" onClick={handleAddChecklistItem}>
                  <Plus className="h-4 w-4 mr-1" /> Add Item
                </Button>
              </div>
              {newFormData.checklistItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={item}
                    onChange={(e) => handleChecklistItemChange(index, e.target.value)}
                    placeholder={`Checklist item ${index + 1}`}
                  />
                  {newFormData.checklistItems.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveChecklistItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateFormDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateForm}>Create Form</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Session Dialog */}
      <Dialog open={isCreateSessionDialogOpen} onOpenChange={setIsCreateSessionDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Toolbox Talk Session</DialogTitle>
            <DialogDescription>
              Schedule a new toolbox talk session.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="formId" className="text-right">
                Form
              </Label>
              <Select
                value={newSessionData.formId}
                onValueChange={(value) => setNewSessionData({ ...newSessionData, formId: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a form" />
                </SelectTrigger>
                <SelectContent>
                  {toolboxForms.map((form) => (
                    <SelectItem key={form.id} value={form.id}>
                      {form.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sessionDate" className="text-right">
                Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newSessionData.sessionDate ? (
                        format(newSessionData.sessionDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newSessionData.sessionDate}
                      onSelect={(date) => setNewSessionData({ ...newSessionData, sessionDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                value={newSessionData.location}
                onChange={(e) => setNewSessionData({ ...newSessionData, location: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Input
                id="notes"
                value={newSessionData.notes}
                onChange={(e) => setNewSessionData({ ...newSessionData, notes: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateSessionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSession}>Create Session</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ToolboxTalkDashboard;