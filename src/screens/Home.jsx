import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { createStudents, deleteStudents } from "../graphql/mutations";
import { listStudents } from "../graphql/queries";
import "./Home.css";
export default function Home() {
  const [studentName, setStudentName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Fetch the list of students when the component mounts
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await API.graphql(graphqlOperation(listStudents));
      const studentItems = response.data.listStudents.items;
      setStudents(studentItems);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleCreateStudent = async () => {
    try {
      const studentData = {
        input: {
          name: studentName,
          birthDate: birthDate,
        },
      };

      const response = await API.graphql(
        graphqlOperation(createStudents, studentData)
      );

      // Check if the student was created successfully
      if (response.data.createStudents) {
        setSuccessMessage("Student added successfully!");
        setStudentName("");
        setBirthDate("");
        setErrorMessage("");
        fetchStudents();
      }
    } catch (error) {
      // Handle the error by setting the error message
      setErrorMessage("Error creating student: " + error.message);
      // Clear any previous success message
      setSuccessMessage("");
    }
  };
  const handleDeleteStudent = async (studentId) => {
    try {
      const studentData = {
        input: {
          id: studentId,
        },
      };

      const response = await API.graphql(
        graphqlOperation(deleteStudents, studentData)
      );

      // Check if the student was deleted successfully
      if (response.data.deleteStudents) {
        // Fetch the updated list of students after deletion
        fetchStudents();
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div>
      <div className={`dropdown ${isDropdownOpen ? "open" : ""}`}>
        <button className="dropdown-button" onClick={toggleDropdown}>
          Create Intro
        </button>
        {isDropdownOpen && (
          <div className="create-student-form">
            <input
              className="input-field"
              type="text"
              placeholder="Student Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
            <input
              className="input-field"
              type="date"
              placeholder="Date of Birth"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
            <button className="create-button" onClick={handleCreateStudent}>
              ADD
            </button>
          </div>
        )}
      </div>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="student-container">
        <h2 className="student-title">Student List</h2>
        <ul>
          {students.map((student) => (
            <li key={student.id}>
              <div className="student-info">
                <div className="student-name">{student.name}</div>
                <div className="student-address">{student.birthDate}</div>
                <div className="student-button">
                  <button
                    className="student-btn"
                    onClick={() => handleDeleteStudent(student.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
