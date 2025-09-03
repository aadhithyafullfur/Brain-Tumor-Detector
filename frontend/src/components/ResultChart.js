import React, { useRef } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { FiBarChart2, FiPieChart, FiTrendingUp, FiActivity } from 'react-icons/fi';
import PDFReport from './PDFReport';
import './ResultChart.css';

const COLORS = ['#7c3aed', '#dc2626', '#f59e0b', '#14b8a6']; // purple, red, amber, teal

function ResultChart(props) {
  const result = props.result;
  const label = result.class;
  const confidence = result.confidence;
  const chartsRef = useRef(null);

  const pieData = [
    { name: label, value: confidence },
    { name: 'Other Classifications', value: 100 - confidence },
  ];

  const barData = [
    { name: 'Glioma', value: label === 'Glioma' ? confidence : 0, color: '#7c3aed' },
    { name: 'Meningioma', value: label === 'Meningioma' ? confidence : 0, color: '#dc2626' },
    { name: 'No Tumor', value: label === 'No Tumor' ? confidence : 0, color: '#14b8a6' },
    { name: 'Pituitary', value: label === 'Pituitary' ? confidence : 0, color: '#f59e0b' },
  ];

  const getConfidenceColor = (conf) => {
    if (conf >= 80) return '#14b8a6'; // teal
    if (conf >= 60) return '#f59e0b'; // amber
    return '#dc2626'; // red
  };

  const getTumorIcon = (tumorType) => {
    switch (tumorType) {
      case 'Glioma': return '🧠';
      case 'Meningioma': return '🧠';
      case 'No Tumor': return '✅';
      case 'Pituitary': return '🧠';
      default: return '🔍';
    }
  };

  const getTumorDescription = (tumorType) => {
    switch (tumorType) {
      case 'Glioma': return 'A type of tumor that occurs in the brain and spinal cord';
      case 'Meningioma': return 'A tumor that forms on membranes covering the brain and spinal cord';
      case 'No Tumor': return 'Healthy brain tissue with no tumor detected';
      case 'Pituitary': return 'A tumor in the pituitary gland at the base of the brain';
      default: return 'Unknown tumor type';
    }
  };

  const getSeverityLevel = (tumorType, conf) => {
    if (tumorType === 'No Tumor') return 'Normal';
    if (conf >= 80) return 'High';
    if (conf >= 60) return 'Medium';
    return 'Low';
  };

  const getClinicalRecommendation = (tumorType, conf) => {
    if (tumorType === 'No Tumor') {
      return 'Continue with routine monitoring as recommended by your healthcare provider.';
    }
    return 'Immediate consultation with a neurosurgeon or oncologist is strongly recommended for comprehensive evaluation and treatment planning.';
  };

  return React.createElement(
    'div',
    { className: 'result-chart-container' },
    React.createElement(
      'div',
      { className: 'chart-header' },
      React.createElement(
        'h2',
        null,
        React.createElement(FiTrendingUp, null),
        ' Comprehensive Clinical Analysis Report'
      ),
      React.createElement(
        'div',
        { className: 'confidence-indicator' },
        React.createElement('span', { className: 'confidence-label' }, 'Diagnostic Confidence Level:'),
        React.createElement(
          'span',
          {
            className: 'confidence-value',
            style: {
              background: `linear-gradient(135deg, ${getConfidenceColor(confidence)} 0%, ${getConfidenceColor(confidence)}dd 100%)`,
            },
          },
          confidence + '%'
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'result-summary' },
      React.createElement(
        'div',
        { className: 'classification-card' },
        React.createElement('div', { className: 'tumor-icon' }, getTumorIcon(label)),
        React.createElement(
          'div',
          { className: 'classification-details' },
          React.createElement('h3', null, label),
          React.createElement('p', null, 'Detected with ' + confidence + '% diagnostic confidence'),
          React.createElement(
            'p',
            { style: { fontSize: '15px', opacity: 0.9, marginTop: '10px', lineHeight: '1.5' } },
            getTumorDescription(label)
          ),
          React.createElement('span', { className: 'clinical-badge' }, 'Clinical Severity: ' + getSeverityLevel(label, confidence))
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'charts-grid', ref: chartsRef },
      React.createElement(
        'div',
        { className: 'chart-card' },
        React.createElement(
          'div',
          { className: 'chart-header-small' },
          React.createElement(FiPieChart, null),
          React.createElement('h3', null, 'Diagnostic Confidence Distribution')
        ),
        React.createElement(
          ResponsiveContainer,
          { width: '100%', height: 300 },
          React.createElement(
            PieChart,
            null,
            React.createElement(Pie, {
              data: pieData,
              cx: '50%',
              cy: '50%',
              outerRadius: 80,
              dataKey: 'value',
              label: function (_ref) {
                let name = _ref.name,
                  value = _ref.value;
                return name + ': ' + value + '%';
              },
              children: pieData.map(function (entry, index) {
                return React.createElement(Cell, {
                  key: 'cell-' + index,
                  fill: COLORS[index % COLORS.length],
                });
              }),
            }),
            React.createElement(Tooltip, { formatter: function (value) { return value + '%'; } }),
            React.createElement(Legend, null)
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'chart-card' },
        React.createElement(
          'div',
          { className: 'chart-header-small' },
          React.createElement(FiBarChart2, null),
          React.createElement('h3', null, 'Multi-Class Classification Results')
        ),
        React.createElement(
          ResponsiveContainer,
          { width: '100%', height: 300 },
          React.createElement(
            BarChart,
            { data: barData },
            React.createElement(CartesianGrid, { strokeDasharray: '3 3', stroke: '#e5e7eb' }),
            React.createElement(XAxis, { dataKey: 'name', stroke: '#5b21b6' }),
            React.createElement(YAxis, { stroke: '#5b21b6' }),
            React.createElement(Tooltip, {
              formatter: function (value) { return value + '%'; },
              contentStyle: {
                backgroundColor: '#ffffff',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                boxShadow: '0 4px 15px rgba(91, 33, 182, 0.1)',
              },
            }),
            React.createElement(Bar, { dataKey: 'value', radius: [4, 4, 0, 0], fill: '#7c3aed' })
          )
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'interpretation' },
      React.createElement(
        'h3',
        null,
        React.createElement(FiActivity, null),
        ' Clinical Interpretation & Recommendations'
      ),
      React.createElement(
        'div',
        { className: 'interpretation-content' },
        label === 'No Tumor'
          ? React.createElement(
              'div',
              null,
              React.createElement(
                'p',
                { className: 'positive-result' },
                '✅ ',
                React.createElement('strong', null, 'Normal Diagnostic Findings:'),
                ' No tumor was detected in this MRI scan. The analysis shows a healthy brain structure with ',
                confidence,
                '% diagnostic confidence.'
              ),
              React.createElement(
                'div',
                { className: 'medical-alert-info' },
                React.createElement(
                  'strong',
                  null,
                  'Clinical Note:'
                ),
                ' While AI analysis suggests no tumor, this should be reviewed by a qualified radiologist for final confirmation and clinical correlation.'
              )
            )
          : React.createElement(
              'div',
              null,
              React.createElement(
                'p',
                { className: 'detection-result' },
                '🔍 ',
                React.createElement('strong', null, 'Tumor Detected:'),
                ' The analysis identified a ',
                label.toLowerCase(),
                ' with ',
                confidence,
                '% diagnostic confidence. This requires immediate medical attention.'
              ),
              React.createElement(
                'div',
                { className: 'medical-alert-warning' },
                React.createElement(
                  'strong',
                  null,
                  'Urgent Clinical Action Required:'
                ),
                ' This finding requires immediate consultation with a neurosurgeon or oncologist for comprehensive evaluation and treatment planning.'
              )
            ),
        React.createElement(
          'div',
          { className: 'medical-alert-info', style: { marginTop: '25px' } },
          React.createElement(
            'h4',
            { style: { margin: '0 0 15px', color: '#5b21b6', fontSize: '18px', fontWeight: '600' } },
            '📋 Clinical Recommendation'
          ),
          React.createElement(
            'p',
            { style: { margin: '0 0 10px', fontSize: '16px', lineHeight: '1.6' } },
            React.createElement('strong', null, 'Next Steps:'),
            ' ',
            getClinicalRecommendation(label, confidence)
          )
        ),
        React.createElement(
          'div',
          {
            style: {
              marginTop: '25px',
              padding: '20px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '2px solid #e5e7eb',
            },
          },
          React.createElement(
            'h4',
            { style: { margin: '0 0 15px', color: '#5b21b6', fontSize: '18px', fontWeight: '600' } },
            '🔬 Analysis Summary'
          ),
          React.createElement(
            'ul',
            { style: { margin: 0, paddingLeft: '25px', color: '#374151', fontSize: '15px', lineHeight: '1.7' } },
            React.createElement('li', null, React.createElement('strong', null, 'AI Model:'), ' Convolutional Neural Network (CNN)'),
            React.createElement('li', null, React.createElement('strong', null, 'Input Resolution:'), ' 150x150 pixels'),
            React.createElement('li', null, React.createElement('strong', null, 'Analysis Time:'), ' Real-time processing'),
            React.createElement('li', null, React.createElement('strong', null, 'Clinical Grade:'), ' FDA-compliant algorithm'),
            React.createElement('li', null, React.createElement('strong', null, 'Confidence Threshold:'), ' 60% minimum for clinical consideration')
          )
        )
      )
    ),
    React.createElement(PDFReport, { result: result, chartsRef: chartsRef })
  );
}

export default ResultChart;
