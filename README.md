# 🧠 Brain Tumor MRI Classifier

A modern web application for classifying brain tumors from MRI scans using deep learning. The application provides an intuitive interface for uploading MRI images and displays detailed analysis results with visualizations.

## ✨ Features

- **Drag & Drop Upload**: Easy file upload with drag-and-drop support
- **Real-time Analysis**: Instant brain tumor classification using TensorFlow
- **Beautiful Visualizations**: Interactive charts showing classification results
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Multiple Tumor Types**: Classifies Glioma, Meningioma, No Tumor, and Pituitary
- **Confidence Scoring**: Shows prediction confidence with color-coded indicators

## 🏗️ Architecture

- **Frontend**: React.js with modern UI components
- **Backend**: Flask API with TensorFlow model
- **Model**: Pre-trained CNN for brain tumor classification
- **Visualization**: Recharts for interactive data visualization

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd brain-tumor-app
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

#### Option 1: Using the provided scripts

**Windows (PowerShell):**
```powershell
.\start_servers.ps1
```

**Windows (Command Prompt):**
```cmd
start_servers.bat
```

#### Option 2: Manual startup

1. **Start the Backend Server**
   ```bash
   cd backend
   python app.py
   ```
   The backend will run on `http://localhost:5000`

2. **Start the Frontend Server**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on `http://localhost:3000`

3. **Open your browser** and navigate to `http://localhost:3000`

## 🧪 Testing

### Test Backend API
```bash
cd backend
python test_endpoint.py
```

### Test Model
```bash
cd backend
python test_model.py
```

## 📁 Project Structure

```
brain-tumor-app/
├── backend/
│   ├── app.py                 # Flask API server
│   ├── model/
│   │   └── brain_tumor_classifier.h5  # Pre-trained model
│   ├── requirements.txt       # Python dependencies
│   ├── test_endpoint.py      # API testing script
│   └── test_model.py         # Model testing script
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadForm.js     # File upload component
│   │   │   ├── UploadForm.css    # Upload styling
│   │   │   ├── ResultChart.js    # Visualization component
│   │   │   └── ResultChart.css   # Chart styling
│   │   ├── App.js               # Main application
│   │   ├── App.css              # App styling
│   │   └── index.js             # Entry point
│   ├── package.json             # Node.js dependencies
│   └── public/                  # Static assets
├── start_servers.ps1           # PowerShell startup script
├── start_servers.bat           # Batch startup script
└── README.md                   # This file
```

## 🎯 How to Use

1. **Upload an MRI Image**
   - Click "Choose File" or drag and drop an image
   - Supported formats: PNG, JPG, JPEG
   - The image will be automatically resized to 150x150 pixels

2. **Analyze the Image**
   - Click "Analyze MRI" to process the image
   - The system will classify the tumor type and show confidence

3. **View Results**
   - See the classification result with confidence percentage
   - Explore interactive charts showing the analysis
   - Read the interpretation of results

## 🔬 Tumor Types

The model can classify the following types:

- **Glioma** 🧠: A type of tumor that occurs in the brain and spinal cord
- **Meningioma** 🫀: A tumor that forms on membranes that cover the brain and spinal cord
- **No Tumor** ✅: Healthy brain tissue with no tumor detected
- **Pituitary** ⚕️: A tumor in the pituitary gland at the base of the brain

## 🛠️ Technical Details

### Backend API Endpoints

- `GET /` - Health check endpoint
- `POST /predict` - Image classification endpoint

### Model Specifications

- **Architecture**: Convolutional Neural Network (CNN)
- **Input Size**: 150x150 pixels
- **Output**: 4 classes (Glioma, Meningioma, No Tumor, Pituitary)
- **Framework**: TensorFlow/Keras

### Frontend Technologies

- **React 18** with functional components and hooks
- **Recharts** for data visualization
- **React Icons** for modern iconography
- **Axios** for API communication
- **CSS3** with modern styling and animations

## 🔧 Troubleshooting

### Common Issues

1. **Backend won't start**
   - Ensure Python 3.8+ is installed
   - Check if all dependencies are installed: `pip install -r requirements.txt`
   - Verify the model file exists in `backend/model/`

2. **Frontend won't start**
   - Ensure Node.js 14+ is installed
   - Run `npm install` in the frontend directory
   - Check if port 3000 is available

3. **Upload fails**
   - Ensure the backend is running on port 5000
   - Check if the image format is supported (PNG, JPG, JPEG)
   - Verify the image file is not corrupted

4. **Model loading error**
   - Ensure the model file `brain_tumor_classifier.h5` is present
   - Check if TensorFlow is properly installed
   - Verify sufficient memory is available

### Performance Tips

- Use images with good contrast for better accuracy
- Ensure images are properly centered on the brain
- For best results, use high-quality MRI scans

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This application is for educational and research purposes only. It should not be used for actual medical diagnosis. Always consult with qualified medical professionals for proper diagnosis and treatment.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Ensure all dependencies are properly installed
4. Verify the model file is present and accessible

---

**Made with ❤️ for medical AI research** 