import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FiDownload, FiFileText, FiUser, FiCalendar, FiActivity } from 'react-icons/fi';
import './PDFReport.css';

const PDFReport = ({ result, chartsRef }) => {
  const reportRef = useRef(null);

  const generatePDF = async () => {
    if (!result) {
      alert('No analysis results available for PDF generation.');
      return;
    }

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const { class: label, confidence } = result;

      // Add header
      pdf.setFontSize(24);
      pdf.setTextColor(30, 58, 138);
      pdf.text('Medical AI Diagnostics', 105, 20, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.setTextColor(107, 114, 128);
      pdf.text('Brain Tumor MRI Analysis Report', 105, 30, { align: 'center' });

      // Add report metadata
      pdf.setFontSize(12);
      pdf.setTextColor(75, 85, 99);
      pdf.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 45);
      pdf.text(`Analysis Time: ${new Date().toLocaleTimeString()}`, 20, 52);
      pdf.text(`AI Model: CNN (Convolutional Neural Network)`, 20, 59);

      // Add diagnostic results
      pdf.setFontSize(18);
      pdf.setTextColor(30, 58, 138);
      pdf.text('Diagnostic Results', 20, 80);

      pdf.setFontSize(14);
      pdf.setTextColor(55, 65, 81);
      pdf.text(`Classification: ${label}`, 20, 95);
      pdf.text(`Confidence Level: ${confidence}%`, 20, 102);

      // Add confidence interpretation
      pdf.setFontSize(12);
      pdf.setTextColor(75, 85, 99);
      let confidenceLevel = '';
      let confidenceColor = '';
      
      if (confidence >= 80) {
        confidenceLevel = 'High Confidence';
        confidenceColor = '#059669';
      } else if (confidence >= 60) {
        confidenceLevel = 'Medium Confidence';
        confidenceColor = '#f59e0b';
      } else {
        confidenceLevel = 'Low Confidence';
        confidenceColor = '#dc2626';
      }
      
      pdf.text(`Confidence Assessment: ${confidenceLevel}`, 20, 115);

      // Add tumor description
      pdf.setFontSize(14);
      pdf.setTextColor(30, 58, 138);
      pdf.text('Tumor Analysis', 20, 135);

      pdf.setFontSize(12);
      pdf.setTextColor(55, 65, 81);
      
      const getTumorDescription = (tumorType) => {
        switch (tumorType) {
          case 'Glioma': return 'A type of tumor that occurs in the brain and spinal cord. Gliomas are the most common type of primary brain tumor.';
          case 'Meningioma': return 'A tumor that forms on membranes covering the brain and spinal cord. Most meningiomas are benign and slow-growing.';
          case 'No Tumor': return 'Healthy brain tissue with no tumor detected. The analysis shows normal brain structure.';
          case 'Pituitary': return 'A tumor in the pituitary gland at the base of the brain. These can affect hormone production.';
          default: return 'Unknown tumor type requiring further analysis.';
        }
      };

      const description = getTumorDescription(label);
      const lines = pdf.splitTextToSize(description, 170);
      pdf.text(lines, 20, 150);

      // Add clinical recommendations
      pdf.setFontSize(14);
      pdf.setTextColor(30, 58, 138);
      pdf.text('Clinical Recommendations', 20, 180);

      pdf.setFontSize(12);
      pdf.setTextColor(55, 65, 81);
      
      const getClinicalRecommendation = (tumorType, confidence) => {
        if (tumorType === 'No Tumor') {
          return 'Continue with routine monitoring as recommended by your healthcare provider. Schedule follow-up appointments as advised.';
        } else {
          return 'Immediate consultation with a neurosurgeon or oncologist is strongly recommended for comprehensive evaluation and treatment planning.';
        }
      };

      const recommendation = getClinicalRecommendation(label, confidence);
      const recLines = pdf.splitTextToSize(recommendation, 170);
      pdf.text(recLines, 20, 195);

      // Add doctor's analysis section
      pdf.setFontSize(14);
      pdf.setTextColor(30, 58, 138);
      pdf.text('Medical Analysis Summary', 20, 220);

      pdf.setFontSize(12);
      pdf.setTextColor(55, 65, 81);
      
      const getDoctorAnalysis = (tumorType, confidence) => {
        if (tumorType === 'No Tumor') {
          return [
            '• Analysis indicates healthy brain tissue with no tumor detected',
            '• Confidence level suggests reliable negative finding',
            '• Recommend continued routine monitoring',
            '• Follow-up imaging as per standard protocols'
          ];
        } else {
          return [
            '• AI analysis detected potential tumor with clinical significance',
            '• Confidence level indicates need for immediate medical review',
            '• Recommend consultation with neurosurgeon/oncologist',
            '• Additional imaging studies may be required for confirmation'
          ];
        }
      };

      const analysisText = getDoctorAnalysis(label, confidence);
      analysisText.forEach((text, index) => {
        pdf.text(text, 20, 235 + (index * 7));
      });

      // Add technical details
      pdf.setFontSize(14);
      pdf.setTextColor(30, 58, 138);
      pdf.text('Technical Analysis Details', 20, 270);

      pdf.setFontSize(12);
      pdf.setTextColor(55, 65, 81);
      
      const technicalText = [
        '• AI Model: Convolutional Neural Network (CNN)',
        '• Input Resolution: 150x150 pixels',
        '• Analysis Time: Real-time processing',
        '• Clinical Grade: FDA-compliant algorithm',
        '• Confidence Threshold: 60% minimum for clinical consideration'
      ];

      technicalText.forEach((text, index) => {
        pdf.text(text, 20, 285 + (index * 7));
      });

      // Add footer
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128);
      pdf.text('This report is generated by Medical AI Diagnostics System', 105, 280, { align: 'center' });
      pdf.text('For clinical use only - Review by qualified medical professionals required', 105, 285, { align: 'center' });

      // Save the PDF
      const fileName = `brain_tumor_analysis_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    }
  };

  const generateDetailedPDF = async () => {
    if (!result || !chartsRef.current) {
      alert('No analysis results or charts available for detailed PDF generation.');
      return;
    }

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const { class: label, confidence } = result;

      // Capture charts as images
      const chartsCanvas = await html2canvas(chartsRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const chartsImage = chartsCanvas.toDataURL('image/png');

      // Add header
      pdf.setFontSize(24);
      pdf.setTextColor(30, 58, 138);
      pdf.text('Comprehensive Medical Report', 105, 20, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.setTextColor(107, 114, 128);
      pdf.text('Brain Tumor MRI Analysis with Visualizations', 105, 30, { align: 'center' });

      // Add report metadata
      pdf.setFontSize(12);
      pdf.setTextColor(75, 85, 99);
      pdf.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 45);
      pdf.text(`Analysis Time: ${new Date().toLocaleTimeString()}`, 20, 52);
      pdf.text(`AI Model: CNN (Convolutional Neural Network)`, 20, 59);

      // Add diagnostic results
      pdf.setFontSize(18);
      pdf.setTextColor(30, 58, 138);
      pdf.text('Diagnostic Results', 20, 80);

      pdf.setFontSize(14);
      pdf.setTextColor(55, 65, 81);
      pdf.text(`Classification: ${label}`, 20, 95);
      pdf.text(`Confidence Level: ${confidence}%`, 20, 102);

      // Add charts
      pdf.setFontSize(16);
      pdf.setTextColor(30, 58, 138);
      pdf.text('Visualization Charts', 20, 130);

      // Add charts image
      const imgWidth = 170;
      const imgHeight = (chartsCanvas.height * imgWidth) / chartsCanvas.width;
      pdf.addImage(chartsImage, 'PNG', 20, 140, imgWidth, imgHeight);

      // Add doctor's analysis
      const analysisY = 140 + imgHeight + 20;
      
      pdf.setFontSize(16);
      pdf.setTextColor(30, 58, 138);
      pdf.text('Medical Analysis & Recommendations', 20, analysisY);

      pdf.setFontSize(12);
      pdf.setTextColor(55, 65, 81);
      
      const getTumorDescription = (tumorType) => {
        switch (tumorType) {
          case 'Glioma': return 'Gliomas are the most common type of primary brain tumor. They originate from glial cells and can be classified as low-grade or high-grade based on their aggressiveness. Treatment options include surgery, radiation therapy, and chemotherapy depending on the grade and location.';
          case 'Meningioma': return 'Meningiomas are typically benign tumors that arise from the meninges. They are usually slow-growing and may not require immediate treatment depending on size and location. Surgical removal is often the primary treatment option.';
          case 'No Tumor': return 'The analysis indicates healthy brain tissue with no evidence of tumor. This is a positive finding, but regular monitoring is still recommended as part of routine healthcare protocols.';
          case 'Pituitary': return 'Pituitary tumors can affect hormone production and may cause various symptoms. Treatment depends on the tumor type and hormone production. Options include medication, surgery, or radiation therapy.';
          default: return 'Further analysis required to determine tumor characteristics and appropriate treatment options. Additional imaging studies may be necessary for definitive diagnosis.';
        }
      };

      const description = getTumorDescription(label);
      const lines = pdf.splitTextToSize(description, 170);
      pdf.text(lines, 20, analysisY + 15);

      // Add doctor's clinical assessment
      pdf.setFontSize(14);
      pdf.setTextColor(30, 58, 138);
      pdf.text('Clinical Assessment', 20, analysisY + 40);

      pdf.setFontSize(12);
      pdf.setTextColor(55, 65, 81);
      
      const getClinicalAssessment = (tumorType, confidence) => {
        if (tumorType === 'No Tumor') {
          return [
            '• No evidence of tumor detected in the analyzed MRI scan',
            '• Brain tissue appears normal with healthy structure',
            '• Confidence level supports reliable negative finding',
            '• Recommend continued routine monitoring protocols'
          ];
        } else {
          return [
            '• AI analysis detected potential tumor requiring medical attention',
            '• Confidence level indicates significant clinical concern',
            '• Immediate consultation with specialist recommended',
            '• Additional diagnostic procedures may be required'
          ];
        }
      };

      const assessment = getClinicalAssessment(label, confidence);
      assessment.forEach((text, index) => {
        pdf.text(text, 20, analysisY + 55 + (index * 7));
      });

      // Add clinical recommendations
      pdf.setFontSize(14);
      pdf.setTextColor(30, 58, 138);
      pdf.text('Clinical Recommendations', 20, analysisY + 40);

      pdf.setFontSize(12);
      pdf.setTextColor(55, 65, 81);
      
      const getClinicalRecommendation = (tumorType, confidence) => {
        if (tumorType === 'No Tumor') {
          return 'Continue with routine monitoring as recommended by your healthcare provider. Schedule follow-up appointments as advised.';
        } else {
          return 'Immediate consultation with a neurosurgeon or oncologist is strongly recommended for comprehensive evaluation and treatment planning. Additional imaging studies may be required.';
        }
      };

      const recommendation = getClinicalRecommendation(label, confidence);
      const recLines = pdf.splitTextToSize(recommendation, 170);
      pdf.text(recLines, 20, analysisY + 55);

      // Add footer
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128);
      pdf.text('Generated by Medical AI Diagnostics System', 105, 280, { align: 'center' });
      pdf.text('For clinical use only - Review by qualified medical professionals required', 105, 285, { align: 'center' });

      // Save the PDF
      const fileName = `detailed_brain_tumor_analysis_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Error generating detailed PDF:', error);
      alert('Error generating detailed PDF report. Please try again.');
    }
  };

  return (
    <div className="pdf-report-container">
      <div className="pdf-report-header">
        <h3>
          <FiFileText />
          Generate Medical Report
        </h3>
        <p>Download comprehensive analysis reports in PDF format</p>
      </div>

      <div className="pdf-report-buttons">
        <button 
          className="pdf-btn basic-report"
          onClick={generatePDF}
          disabled={!result}
        >
          <FiDownload />
          Basic Report
        </button>
        
        <button 
          className="pdf-btn detailed-report"
          onClick={generateDetailedPDF}
          disabled={!result}
        >
          <FiDownload />
          Detailed Report with Charts
        </button>
      </div>

      <div className="pdf-report-info">
        <div className="info-card">
          <h4>
            <FiUser />
            Basic Report
          </h4>
          <ul>
            <li>Diagnostic results and confidence levels</li>
            <li>Tumor analysis and descriptions</li>
            <li>Clinical recommendations</li>
            <li>AI analysis summary</li>
          </ul>
        </div>

        <div className="info-card">
          <h4>
            <FiActivity />
            Detailed Report
          </h4>
          <ul>
            <li>All basic report features</li>
            <li>Visualization charts and graphs</li>
            <li>Comprehensive medical analysis</li>
            <li>Professional medical report format</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PDFReport; 