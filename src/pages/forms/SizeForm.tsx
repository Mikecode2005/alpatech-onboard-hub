import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/state/appState";
import { useNavigate } from "react-router-dom";

const coverallSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const shoeSizes = ["6", "7", "8", "9", "10", "11", "12", "13", "14", "15"];

const SizeForm = () => {
  const navigate = useNavigate();
  const { submitSizeForm, user } = useAppState();
  const { toast } = useToast();

  const [form, setForm] = useState({
    traineeId: "",
    coverallSize: "",
    shoeSize: "",
    submittedBy: user?.email || "",
    submittedDate: new Date().toISOString().split('T')[0],
  });

  const onSubmit = () => {
    if (!form.traineeId || !form.coverallSize || !form.shoeSize) {
      toast({ title: "All fields are required" });
      return;
    }

    submitSizeForm(form);
    toast({ title: "Size Form Submitted Successfully!" });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Size Form | Alpatech</title>
        <meta name="description" content="Submit trainee size information for coveralls and shoes." />
      </Helmet>
      <div className="container mx-auto py-10 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Trainee Size Form</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label>Trainee ID/Email</Label>
              <Input 
                placeholder="trainee@company.com"
                value={form.traineeId}
                onChange={(e) => setForm({ ...form, traineeId: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label>Coverall Size</Label>
              <Select value={form.coverallSize} onValueChange={(v) => setForm({ ...form, coverallSize: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select coverall size" />
                </SelectTrigger>
                <SelectContent>
                  {coverallSizes.map((size) => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Shoe Size</Label>
              <Select value={form.shoeSize} onValueChange={(v) => setForm({ ...form, shoeSize: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select shoe size" />
                </SelectTrigger>
                <SelectContent>
                  {shoeSizes.map((size) => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Submitted By</Label>
                <Input 
                  value={form.submittedBy}
                  onChange={(e) => setForm({ ...form, submittedBy: e.target.value })}
                  disabled
                />
              </div>
              <div className="grid gap-2">
                <Label>Date</Label>
                <Input 
                  type="date"
                  value={form.submittedDate}
                  onChange={(e) => setForm({ ...form, submittedDate: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button variant="outline" onClick={() => navigate("/dashboard")} className="flex-1">
              Cancel
            </Button>
            <Button variant="hero" onClick={onSubmit} className="flex-1">
              Submit Size Form
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SizeForm;