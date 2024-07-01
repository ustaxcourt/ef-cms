//
// Dynamsoft JavaScript Library for Basic Initiation of Dynamic Web TWAIN
// More info on Dynamic Web TWAIN: http://www.dynamsoft.com/Products/WebTWAIN_Overview.aspx
//
// Copyright 2024, Dynamsoft Corporation 
// Author: Dynamsoft Team
// Version: 18.5
//
/// <reference path="dynamsoft.webtwain.initiate.js" />
var Dynamsoft = Dynamsoft || { DWT: {} };

///
Dynamsoft.DWT.AutoLoad = true;
///
Dynamsoft.DWT.Containers = [{ WebTwainId: '', ContainerId: 'dwtcontrolContainer', Width: 350, Height: 380 }];

/////////////////////////////////////////////////////////////////////////////////////
//  WARNING:  The productKey in this file is protected by copyright law            //
//  and international treaty provisions. Unauthorized reproduction or              //
//  distribution of this  productKey, or any portion of it, may result in severe   //
//  criminal and civil penalties, and will be prosecuted to the maximum            //
//  extent possible under the law.  Further, you may not reverse engineer,         //
//  decompile, disassemble, or modify the productKey .                             //
/////////////////////////////////////////////////////////////////////////////////////
/// If you need to use multiple keys on the same server, you can combine keys and write like this 
/// Dynamsoft.DWT.ProductKey = 'key1;key2;key3';
/// To get a free trial, please visit https://www.dynamsoft.com/customer/license/trialLicense?product=dwt&utm_source=installer.
Dynamsoft.DWT.ProductKey = 't0114QAEAAHnlL0m0en2PPDysdeNS5Imzc5JR5RUQspAFMKSILdR6OBzqG+LjhI+FihbdcoC+CxyrTRfu3XzCJqzsoL84mN82GZ/MzRzdP2T6egItI0+qQy0RzGNmvzT+D/54vLbO1K4xUhlatCRpPQFnUT8+';

///
//Dynamsoft.DWT.ResourcesPath = 'Resources';

///
Dynamsoft.DWT.IfAddMD5InUploadHeader = false;

///
///true will make our processing icons align with the initiated div container, otherwise align with the whole page instead
Dynamsoft.DWT.IfConfineMaskWithinTheViewer = true;
/*Dynamsoft.DWT.CustomizableDisplayInfo = {

    errorMessages: {

        // launch
        ERR_MODULE_NOT_INSTALLED: 'Error: The Dynamic Web TWAIN module is not installed.',
        ERR_BROWSER_NOT_SUPPORT: 'Error: This browser is currently not supported.',
        ERR_CreateID_MustNotInContainers: 'Error: Duplicate ID detected for creating Dynamic Web TWAIN objects, please check and modify.',
		ERR_CreateID_NotContainer: 'Error: The ID of the DIV for creating the new DWT object is invalid.',
        ERR_DWT_NOT_DOWNLOADED: 'Error: Failed to download the Dynamic Web TWAIN module.',

        // image view
        limitReachedForZoomIn: "Error: You have reached the limit for zooming in",
        limitReachedForZoomOut: "Error: You have reached the limit for zooming out",

        // image editor
        insufficientParas: 'Error: Not enough parameters.',
        invalidAngle: 'Error: The angle you entered is invalid.',
        invalidHeightOrWidth: "Error: The height or width you entered is invalid.",
        imageNotChanged: "Error: You have not changed the current image."

    },

    // launch
    generalMessages: {
        checkingDWTVersion: 'Checking WebTwain version ...',
        updatingDService: 'Dynamsoft Service is updating ...',
        downloadingDWTModule: 'Downloading the Dynamic Web TWAIN module.',
        refreshNeeded: 'Please REFRESH your browser.',
        downloadNeeded: 'Please download and install the Dynamic Web TWAIN.',
        DWTmoduleLoaded: 'The Dynamic Web TWAIN module is loaded.'
    },

    customProgressText: {

        // html5 event
        upload: 'Uploading...',
        download: 'Downloading...',
        load: 'Loading...',
        decode: 'Processing...',
        decodeTIFF: 'Processing tiff...',
        decodePDF: 'Processing pdf...',
        encode: 'Processing...',
        encodeTIFF: 'Processing tiff...',
        encodePDF: 'Processing pdf...',

        transfer: 'Transferring...',
        // image control
        canvasLoading: 'Loading ...'
    },

    // image editor
    buttons: {
        titles: {
            'previous': 'Previous Image',
            'next': 'Next Image',
            'print': 'Print Image',
            'scan': 'Acquire new Image(s)',
            'load': 'Load local Image(s)',
            'rotateleft': 'Rotate Left',
            'rotate': 'Rotate',
            'rotateright': 'Rotate Right',
            'deskew': 'Deskew',
            'crop': 'Crop Selected Area',
            'cut': 'Cut Selected Area',
            'changeimagesize': 'Change Image Size',
            'flip': 'Flip Image',
            'mirror': 'Mirror Image',
            'zoomin': 'Zoom In',
            'originalsize': 'Show Original Size',
            'zoomout': 'Zoom Out',
            'stretch': 'Stretch Mode',
            'fit': 'Fit Window',
            'fitw': 'Fit Horizontally',
            'fith': 'Fit Vertically',
            'hand': 'Hand Mode',
            'rectselect': 'Select Mode',
            'zoom': 'Click to Zoom In',
            'restore': 'Restore Orginal Image',
            'save': 'Save Changes',
            'close': 'Close the Editor',
            'removeall': 'Remove All Images',
            'removeselected': 'Remove All Selected Images'
        }
    },

    dialogText: {
        dlgRotateAnyAngle: ['Angle :', 'Interpolation:', 'Keep size', '  OK  ', 'Cancel'],
        dlgChangeImageSize: ['New Height :', 'New Width :', 'Interpolation:', '  OK  ', 'Cancel'],
        saveChangedImage: ['You have changed the image, do you want to keep the change(s)?', '  Yes  ', '  No  '],
        selectSource: ['Select Source:', 'Select', 'Cancel', 'There is no source available!']
    }
};*/


/// All callbacks are defined in the dynamsoft.webtwain.install.js file, you can customize them.
// Dynamsoft.DWT.RegisterEvent('OnWebTwainReady', function(){
// 		// webtwain has been inited
// });

