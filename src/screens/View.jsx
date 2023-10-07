import "./View.css";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API, graphqlOperation } from "aws-amplify";
import { getStudents } from "../graphql/queries"; // Import the query to fetch student details
import top from "../docs/top.png";
import bottom from "../docs/bottom.png";
export default function View() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentDetails();
  }, []); // Fetch student details when the component mounts

  const fetchStudentDetails = async () => {
    try {
      const response = await API.graphql(
        graphqlOperation(getStudents, { id }) // Use the getStudents query with the id parameter
      );

      const studentData = response.data.getStudents;
      setStudent(studentData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching student details:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="view-container">
      <img src={top} alt="" className="top-image" />
      <div>
        {student ? (
          <div className="view-student">
            {student.name}
            <br />
            <p className="welcome-msg">
              Welcome to the Most Friendly School to Learn Martial Arts
            </p>
          </div>
        ) : (
          <div>Student not found</div>
        )}
      </div>
      <img src={bottom} alt="" className="bottom-img" />
    </div>
  );
}
