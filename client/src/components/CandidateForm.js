import React, { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  Typography,
  Paper,
  Grid,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const skillsOptions = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "React",
  "Node.js",
];
const resultOptions = ["Pass", "Fail", "Pending"];

const CandidateForm = ({ candidate, onSave }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const candidateData = location.state;

  const initialFormData = candidateData || {
    firstName: "",
    lastName: "",
    skills: [],
    yearsOfExperience: "",
    location: "",
    codingResult: "",
    videoInterviewResult: "",
  };
  const [formValues, setFormValues] = useState(initialFormData);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSkillsChange = (event) => {
    const { value } = event.target;
    setFormValues({ ...formValues, skills: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (location.state) {
        await axios.put(
          `http://localhost:5000/candidates/${location.state._id}`,
          formValues
        );
      } else {
        await axios.post("http://localhost:5000/candidates", formValues);
      }
      navigate("/");
      onSave();
    } catch (error) {
      console.error("Error saving candidate:", error);
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        maxWidth: "700px",
        margin: "auto",
        p: 4,
        borderRadius: 3,
        backgroundColor: "#f3f6fb",
        boxShadow: "0 12px 24px rgba(0, 0, 0, 0.12)",
        overflow: "hidden",
        position: "relative",
        "&:before": {
          content: '""',
          position: "absolute",
          top: "-100px",
          right: "-150px",
          width: "400px",
          height: "400px",
          background: "linear-gradient(135deg, #ff4081, #3f51b5)",
          borderRadius: "50%",
          opacity: 0.3,
          zIndex: 0,
        },
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          zIndex: 1,
          position: "relative",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          color="#3f51b5"
          mb={2}
          textAlign="center"
        >
          Add New Candidate
        </Typography>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formValues.firstName}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                style: {
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formValues.lastName}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                style: {
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                },
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={8}>
            {/* Skills Multi-select */}
            <FormControl
              fullWidth
              margin="normal"
              required
              variant="outlined"
              sx={{ mb: 2 }}
            >
              <InputLabel>Skills</InputLabel>
              <Select
                name="skills"
                value={formValues.skills}
                onChange={handleSkillsChange}
                multiple
                label="Skills"
                renderValue={(selected) => selected?.join(", ")}
                sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
              >
                {skillsOptions.map((skill) => (
                  <MenuItem key={skill} value={skill}>
                    <Checkbox checked={formValues.skills.indexOf(skill) > -1} />
                    <ListItemText primary={skill} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Years of Experience"
              name="yearsOfExperience"
              value={formValues.yearsOfExperience}
              onChange={handleChange}
              margin="normal"
              type="number"
              required
              InputProps={{
                style: {
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                },
              }}
              sx={{ mb: 2 }}
            />
          </Grid>
        </Grid>

        <TextField
          fullWidth
          label="Location"
          name="location"
          value={formValues.location}
          onChange={handleChange}
          margin="normal"
          required
          InputProps={{
            style: {
              backgroundColor: "#fff",
              borderRadius: "8px",
            },
          }}
          sx={{ mb: 2 }}
        />

        <FormControl
          fullWidth
          margin="normal"
          required
          variant="outlined"
          sx={{ mb: 2 }}
        >
          <InputLabel>Coding Result</InputLabel>
          <Select
            name="codingResult"
            value={formValues.codingResult}
            onChange={handleChange}
            label="Coding Result"
            sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
          >
            {resultOptions.map((result) => (
              <MenuItem key={result} value={result}>
                {result}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          fullWidth
          margin="normal"
          required
          variant="outlined"
          sx={{ mb: 2 }}
        >
          <InputLabel>Video Interview Result</InputLabel>
          <Select
            name="videoInterviewResult"
            value={formValues.videoInterviewResult}
            onChange={handleChange}
            label="Video Interview Result"
            sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
          >
            {resultOptions.map((result) => (
              <MenuItem key={result} value={result}>
                {result}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            mt: 3,
            py: 1.5,
            backgroundColor: "#3f51b5",
            "&:hover": {
              backgroundColor: "#ff4081",
              transition: "all 0.3s ease",
            },
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "8px",
            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.15)",
          }}
        >
          Submit Application
        </Button>
      </Box>
    </Paper>
  );
};

export default CandidateForm;
