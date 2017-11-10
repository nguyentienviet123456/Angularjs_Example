﻿var serviceBase = 'http://localhost:8888/';
var pathSingleSignOn = "http://10.14.68.12:8090/";

app.constant('appSettings', {
    apiServiceBaseUri: serviceBase,
    client: '6c7a1dc3-053b-43d7-bd79-c8ece35abf09',
    timeOut: 15
});

app.constant('constants', {
    singleSignOn: {
        id: "A0745833-43CE-4CAA-A24D-1F1F7896472F",
        applicationId: "A0745833-43CE-4CAA-A24D-1F1F7896472F",
        login: pathSingleSignOn + "api/Web/Auth/Login",
        logout: pathSingleSignOn + "api/Logout",
        domains: pathSingleSignOn + "api/Domains",
        signOn: pathSingleSignOn + "api/SignOn",
        disabled: true
    },
    autoReloadSetting: {
        mode: false,
        delay: 15
    },
    linkApp: {
        ios: "https://i.diawi.com/pHnAwU",
        android: "https://i.diawi.com/TnUXBy"
    },
    loginApp:
    {
        login: serviceBase + "login"
    },
    localStorage:
    {
        accessToken: "accessTokenSingleSignOn",
        logined: "logined",
        userSecret: "userSecret",
        userProfile: "userProfile",
        timeOld: "timeOld"
    },
    state: {
        default: "default",
        downloadApp: "downloadApp",
        login: "login",
        accessdenied: "accessdenied",
        scelist: "scelist",
        landing: "landing",
        scenew: "scenew",
        scecopynew: "scecopynew",
        sceedit: "sceedit",
        sceupdaterequire: "sceupdaterequire",
        scereview: "scereview",
        reviewupdaterequire: "reviewupdaterequire",
        sceendorse: "sceendorse",
        sceapprove: "sceapprove",
        sceacknowledge: "sceacknowledge",
        scelive: "scelive",
        scenormalized: "scenormalized",
        scedetail: "scedetail",
        scePrint: "sceprint",
        raNew: "ranew",
        raDetail: "radetail",
        raEdit: "raedit",
        raUpdateRequired: "raUpdateRequired",
        raReview: "raReview",
        raEndorse: "raEndorse",
        raApprove: "raApprove",
        raInfo: "raInfo",
        raMOC: "raMOC",
        raList: "ralist",
        raPrint: "raprint",
        manageUser: "manageuser",
        sceDashBoard: "scedashboard",
        newUser: "newuser",
        raCopy: "raCopy",
        editUser: "edituser",
        myProfile: "myprofile",
        profile: "profile",
        messageBox: "messagebox",
        adminMessage: "adminmessage",
        raStatusLog: "raStatusLog",
        sceStatusLog: "sceStatusLog",
        notification: "notification",
        notificationList: "notificationList",
        sceViewFile: "sceViewFile",
        asmDetail: "asmDetail",
        requireUpdateMOC: "asmRequiredUpdate",
        asmDashBoard: "asmdashboard",
        asmNewState: "asmNew",
        asmEditDraft: "asmEditDraft",
        asmRequiresUpdate: "asmRequiresUpdate",
        asmendorse: "asmendorse",
        asmlive: "asmlive",
        asmshelving: "asmshelving",
        asmclose: "asmclose",
        asmlist: "asmlist",
        asmCopy: "asmCopy",
        asmStatusLog: "asmStatusLog",
        asmPrint: "asmprint",
        diDashBoard: "didashboard",
        diList: "dilist",
        diNew: "dinew",
        rotfDashboard: "rotfdashboard",
        rotfDashboardOverview: "rotfdashboard.overview",
        rotfDashboardOperation: "rotfdashboard.operation"
    },
    allowAccess: {
        allowRead: "allowRead",
        allowWrite: "allowWrite",
        allowDelete: "allowDelete"
    },
    menu: {
        rotfDashboard: "RotfDashBoard",
        sceDashBoard: "SceDashBoard",
        sceNew: "SceNew",
        sceList: "SceList",
        manageUser: "ManageUser",
        admin: "admin",
        raList: "RaList",
        manageMessage: "manageMessage",
        asmDashBoard: "AsmDashBoard",
        asmNew: "AsmNew",
        asmList: "AsmList",
        diDashBoard: "DiDashBoard",
        diList: "DiList",
        diNew: "DiNew",
        default: "default"
    },
    module: {
        sce: "SCE",
        ra: "RA",
        asm: "ASM",
        di: "DI"
    },
    format: {
        date: {
            default: "MM/dd/yyyy",
            mmddyyyyHHmm: "MM/dd/yyyy HH:mm",
            ddMMMyyyyhhmma: "dd MMM yyyy hh:mm a"
        }
    },
    messages: {
        error: "An error occured while processing",
        networkError: "Network Connect Error",
        invalidEnterprise: "Invalid enterprise ID or password"
    },
    titlePage: {
        downloadApp: "ROTF Application",
        login: "Login",
        SceDashBoard: "SCE DashBoard",
        sceNew: "New SCE",
        sceCopyNew: "Copy new SCE",
        raListing: "RA Listing",
        raNew: "New RA",
        raUpdateRequired: "RA Update Required",
        raUpdate: "RA Update",
        raDetail: "Detail RA",
        raReview: "Review RA",
        raEndorse: "Endorse RA",
        raApprove: "Approve RA",
        raInfo: "Risk Assessment",
        raMOC: "MOC",
        sceListing: "SCE Listing",
        manageUser: "Manage User",
        newUser: "New User",
        editUser: "Update User",
        myProfile: "My Profile",
        profile: "User Profile",
        adminMessage: "Messages",
        statusLog: "Status's Logs",
        notification: "Notifications",
        notificationList: "All Notification",
        asm_detail: "ASM Details",
        requireUpdateMOC: "MOC Update Require",
        AsmDashBoard: "ASM DashBoard",
        asmListing: "ASM Listing",
        asmNew: "ASM New",
        diDashBoard: "DI DashBoard"
    },
    DI: {
        getHseIssue: serviceBase + 'Asm/GetHseIssue',
        getCopSol: serviceBase + 'Asm/GetCopSol'
    },
    SCE: {
        getPendingPeopleForTransferingRoles: serviceBase + "SCE/GetPeopleForTransferingRole/{0}",
        insertSce: serviceBase + "sce",
        transferSce: serviceBase + "sce/{0}/transfersce",
        getPreData: serviceBase + "sce/predataforcreate?controlName={0}&parentId={1}&keyword={2}",
        getApplicantsForTransfer: serviceBase + "sce/{0}/getapplicantstotransfer?keyword={1}",
        getSceListing: serviceBase + "sce/list",
        getSceListingToday: serviceBase + "sce/today",
        getSceDetail: serviceBase + "sce/{0}/detail",
        cancelSce: serviceBase + "sce/{0}",
        reviewSce: serviceBase + "sce/{0}/review",
        endorseSce: serviceBase + "sce/{0}/endorse",
        approveSce: serviceBase + "sce/{0}/approve",
        GetPTWListing: serviceBase + "sce/{0}/ptw",
        AddNewPTW: serviceBase + "sce/{0}/ptw",
        UpdatePTW: serviceBase + "sce/{0}/ptw",
        DeletePTW: serviceBase + "sce/{0}/ptw",
        acknowledgeSce: serviceBase + "sce/{0}/acknowledge",
        getTotalMySceListing: serviceBase + "sce/getTotalMySceListing",
        editSce: serviceBase + "sce/{0}/edit",
        normalizeSce: serviceBase + "sce/{0}/normalize",
        getSceExtApproval: serviceBase + "sce/approvalExtension",
        getSceAcknowledgeSchedule: serviceBase + "sce/reacknowledge",
        getAllUnit: serviceBase + "sce/getallunit",
        getAllTag: serviceBase + "sce/getallscetag",
        getUnitByAreaId: serviceBase + "sce/{0}/getunitbyareaid",
        getUnitByAreaIdAndStatus: serviceBase + "sce/{0}/getunitbyareaid/{1}",
        getTagNoByUnitId: serviceBase + "sce/{0}/getscetagbyunitid",
        getTagNoByUnitIdAndStatus: serviceBase + "sce/{0}/getscetagbyunitid/{1}",
        getSilIdByTagId: serviceBase + "sce/{0}/getSilIdByTagId",
        getScePendingInDashboard: serviceBase + "scedashboard/getscependingactionforscedashboard",
        getRaPendingInDashBoard: serviceBase + "scedashboard/getrapendingactionforscedashboard",
        getScePrintingDetail: serviceBase + "sce/{0}/getsceprintingdetail",
        sceTransferRoles: serviceBase + "sce/{0}/TransferRoles",
        getSCELog: serviceBase + "log/getlogsbysceid",
        getSceCopy: serviceBase + "sce/{0}/copy",
        uploadFiles: serviceBase + "sce/{0}/uploadfiles/{1}",
        getUploadedFiles: serviceBase + "SCE/{0}/GetListFile",
        viewFile: serviceBase + "SCE/{0}/viewFile/{1}",
        exportFile: serviceBase + "SCE/Export",
        approverTranser: serviceBase + "sce/{0}/approverTransfer"
    },
    SCEDashBoard: {
        getSCEDashBoard: serviceBase + "SCEDashBoard",
        getActiveAreas: serviceBase + "SCEDashBoard/Areas",
        getSubscribedAreas: serviceBase + "SCEDashBoard/GetSubscribedAreas",
        getSceLiveStatistic: serviceBase + "SCEDashBoard/GetSceLiveStatistic" 
    },
    ASMDashBoard: {
        getASMDashBoard: serviceBase + "AsmDashBoard",
        getActiveAreas: serviceBase + "AsmDashBoard/Areas",
        getSubscribedAreas: serviceBase + "AsmDashBoard/GetSubscribedAreas",
        getEEMUAData: serviceBase + "AsmDashBoard/GetEEMUA/{0}",
        saveEEMUAData: serviceBase + "AsmDashBoard/UpdateEEMUA/{0}",
        getAsmPendingInDashboard: serviceBase + "Asmdashboard/GetAsmPendingActionForAsmDashBoard"
    },
    ASM: {
        getPendingPeopleForTransferingRoles: serviceBase + "ASM/GetPeopleForTransferingRole/{0}",
        shelveASM: serviceBase + "ASM/ShelvingAlarm/{0}",
        closeASM: serviceBase + "ASM/CloseAlarmShelving/{0}",
        getASMMOCApprovers: serviceBase + "MasterData/GetASMMOCApprovers?keyword={0}",
        submitMOC: serviceBase + "ASM/{0}/SubmitMoc",
        listAsm: serviceBase + "asm/listing",
        totalMyPendingAsm: serviceBase + "asm/totalmypendingAsm",
        creatAsm: serviceBase + "Asm/Create",
        editAsm: serviceBase + "Asm/EditDraft/{0}",
        requiresUpdateAsm: serviceBase + "Asm/ApplicantUpdateRequire/{0}",
        getAreas: serviceBase + "MasterData/GetAreas",
        getUnitByArea: serviceBase + "MasterData/GetUnitsByAreaId?areaId={0}",
        getTagNoByUnit: serviceBase + "MasterData/GetTagsByUnitForASM?unitId={0}",
        getAlarmClasses: serviceBase + "MasterData/GetAlarmClasses",
        getAlarmTypes: serviceBase + "MasterData/GetAlarmTypes",
        getAsmReviewers: serviceBase + "MasterData/GetASMReviewers?keyword={0}",
        cancelAsm: serviceBase + "asm/{0}/Cancel",
        getAsmDetail: serviceBase + "Asm/Detail/{0}",
        reviewAsm: serviceBase + "ASM/{0}/Review",
        endorseAsm: serviceBase + "ASM/{0}/Endorse",
        approveAsm: serviceBase + "asm/{0}/Approve",
        asmTransferRoles: serviceBase + "asm/{0}/TransferRoles",
        transferAsm: serviceBase + "ASM/{0}/TransferASM",
        cancelMOC: serviceBase + "asm/{0}/MocCancel",
        requireUpdateMOC: serviceBase + "asm/{0}/RequiReUpdateMoc",
        approveMoc: serviceBase + "asm/{0}/ApproveMoc",
        getAlarmClosureReason: serviceBase + "MasterData/GetAlarmClosureReason",
        statusKey: {
            application: "21",
            requiresUpdate: "22",
            pendingEndorse: "23",
            pendingReview: "24",            
            pendingApproval: "25",            
            pendingShelving: "26",
            live: "28",
            closed: "30",
            pendingMoc: "31",
            pendingMocApproval: "32",
            requireMocUpdate: "33",            
            moc: "34"            
        },
        getApplicants: serviceBase + "MasterData/GetASMApplicant?keyword={0}",
        getApplicantsForTransfer: serviceBase + "MasterData/GetASMApplicantForTransfering/{0}/?keyword={1}",
        getEndorsers: serviceBase + "MasterData/GetASMEndorsers?keyword={0}",
        getApprovers: serviceBase + "MasterData/GetASMApprovers?keyword={0}",
        getReviewers: serviceBase + "MasterData/GetASMReviewers?keyword={0}",
        getAsmCopy: serviceBase + "ASM/{0}/Copy",
        getAsmLog: serviceBase + "log/getlogsbyasmid",
        getAsmApprovalExtension: serviceBase + "ASM/ApprovalExtension",
        getAsmReShelvingSchedule: serviceBase + "ASM/ReShelvingSchedule",
        getPreData: serviceBase + "ASM/predataforcreate?controlName={0}&parentId={1}&keyword={2}",
        reApproveAsm: serviceBase + "ASM/{0}/ReApprove",
        reShelveAsm: serviceBase + "ASM/{0}/ReShelving",
        getAsmPrintingDetail: serviceBase + "asm/{0}/getasmprintingdetail"
    },
    ROTF: {
        getNPAT: serviceBase + 'RoTF/GetNPAT',
        getOEE: serviceBase + 'RoTF/GetOEE',
        getGoodDaySummary: serviceBase + 'RoTF/GetGoodDaySummary',
        getOperationInfor: serviceBase + 'RoTF/GetOperationInfor',
        getListUnitStatus: serviceBase + + 'RoTF/GetListUnitStatus',
        getAreaOperations: serviceBase + + 'RoTF/GetAreaOperations'
    },
    status: {
        getStatusBySce: serviceBase + "status/GetStatusBySce",
        getListStatisOfRa: serviceBase + "status/getrastatus",
        getListStatusByModuleName: serviceBase + "Status/GetStatusByModule/{0}"
    },
    RA: {
        getPendingPerson: serviceBase + "SCE/{0}/RA/{1}/GetPendingPerson",
        getInitialData: serviceBase + "SCE/{0}/RA/GetInitialData",
        getApplicants: serviceBase + "RA/GetApplicants?keyword={0}",
        getRAFacilitator: serviceBase + "RA/GetFacilitators?keyword={0}",
        getRAEndorsers: serviceBase + "RA/GetRAEndorsers?keyword={0}",
        getRAApprovers: serviceBase + "RA/GetRAApprovers?keyword={0}",
        getMocApprovers: serviceBase + "RA/GetMocApprovers?keyword={0}",
        getSeveritiesByImpactGroup: serviceBase + "RA/GetSeverities/{0}",
        getLikelihoods: serviceBase + "RA/GetLikeliHoods",
        getRiskIdentification: serviceBase + "RA/GetRiskIdentification/{0}/{1}",
        getRABasic: serviceBase + "RA/GetRABasic/{0}",
        updateRA: serviceBase + "SCE/{0}/RA/{1}",
        reviewRA: serviceBase + "SCE/{0}/RA/Review/{1}",
        endorseRA: serviceBase + "SCE/{0}/RA/Endorse/{1}",
        approveRA: serviceBase + "SCE/{0}/RA/Approve/{1}",
        approveMOC: serviceBase + "SCE/{0}/RA/ApproveMOC/{1}",
        cancelRA: serviceBase + "SCE/{0}/RA/Cancel/{1}",
        updateMOC: serviceBase + "SCE/{0}/RA/UpdateMOC/{1}",
        cancelMOC: serviceBase + "SCE/{0}/RA/CancelMOC/{1}",
        consequenceType: {
            people: "people",
            environment: "environment",
            asset: "asset",
            reputation: "reputation"
        },
        getTeamMembers: serviceBase + "User/TeamMembers?keyword={0}",
        getRATeamMembers: serviceBase + "RA/GetRATeamMembers/{0}",
        createRA: serviceBase + "SCE/{0}/RA",
        getRADetail: serviceBase + "SCE/{0}/RA/{1}",
        getRALog: serviceBase + "log/getlogsbyraid",
        raListing: serviceBase + "sce/ra/list",
        getTotalMyRaListing: serviceBase + "sce/ra/gettotalmyralisting",
        transferRoles: serviceBase + "SCE/{0}/RA/TransferRoles/{1}",
        teamMemberSplitSize: 6,
        statusKey: {
            raDraft: "11",
            raUpdateRequired: "19",
            raPendingReview: "12",
            raPendingEndorsement: "13",
            raPendingApproval: "14",
            raApproved: "20",
            raPendingMoc: "15",
            raPendingMocApproval: "16",
            raMocRequiresUpdate: "17",
            raMoc:"18"
        },
        mocStatus: {
            notRequired: 0,
            pendingMOC: 1,
            pendingMOCApproval: 2,
            requiresUpdate: 3,
            moc: 4
        },
        actionResponse: {
            review: "Reviewed",
            endorse: "Endorsed",
            approve: "Approved"
        },
        statusTypeReponse: {
            review: "Review Status",
            endorse: "Endorse Status",
            approve: "Approve Status"
        },
        status: {
            updateRequired: "Update Required",
            pendingReview: "Pending Review",
            pendingEndorse: "Pending Endorsement",
            pendingApproval: "Pending Approval",
            approved: "Approved",
            pendingMOC: "Pending MOC",
            pendingMOCApproval: "Pending MOC Approval",
            MocRequriesUpdate: "MOC Requries Update",
            Moc: "MOC",
            Draft: "Draft"
        },
        riskLevel: {
            lowRisk: 1,
            mediumRisk: 2,
            highRisk: 3,
            veryHigh: 4
        },
        checkRaCopy: serviceBase + "RA/CheckRaCopy/{0}",
        getRaCopy: serviceBase + "RA/GetInfoRaCopy/{0}",
    },
    user: {
        getListUser: serviceBase + "user/list",
        deactivateUser: serviceBase + "user/{0}/deactivate",
        activeUser: serviceBase + "user/{0}/active",
        deactivateListUser: serviceBase + "user/Deactivates",
        adFindUser: serviceBase + "user/AdFindUser?keyWord={0}",
        create: serviceBase + "user/addNew",
        edit: serviceBase + "user/{0}/edit",
        detail: serviceBase + "user/{0}/getdetail",
        getRoleEdit: serviceBase + "user/{0}/getRoleEdit",
        manageRole: serviceBase + "user/{0}/manageRole",
        manageRoles: serviceBase + "user/manageRoles",
        myProfile: serviceBase + "user/myProfile",
        updateMyProfile: serviceBase + "user/myProfile",
        profile: serviceBase + "user/{0}/getProfile"
    },
    role: {
        getAllRoleIncludeNumberUser: serviceBase + "role/getAllRoleIncludeNumberUser",
        getRolesIncludeModule: serviceBase + "role/getRolesIncludeModule",
        roleKeys: {
            //ASM Module
            asmApplicant: "21",
            asmReviewer: "22",
            asmEndorser: "23",
            asmApprover: "24",
            asmShelver: "25",
            asmMocApprover: "27",
            asmAdmin: "26",
            //SCE Module
            sceApplicant: "1",
            sceReviewer: "2",
            sceEndorser: "3",
            sceApprover: "4",
            sceAcknowledger: "5",
            raReviewer: "9",
            raEndorser: "10",
            raApprover: "11",
            mocApprover: "15",
            sceUser: "7",
            raUser: "14",
            sceAdmin: "0"
        }
    },
    area: {
        getAllAreaIsActive: serviceBase + "area/GetAllAreaIsActive",
        getAreaByUserSubscription: serviceBase + "area/{0}/getAreaByUserSubscription"
    },
    risk: {
        getAllRiskLevel: serviceBase + "sce/ra/getallrisklevel"
    },
    impactGroup: {
        people: 'People',
        environment: 'Environment',
        asset: 'Asset',
        reputation: 'Reputation'
    },
    message: {
        getListMessageDashBoard: serviceBase + "message/listMessageDashBoard?moduleName={0}&areaId={1}&messageId={2}&scroll={3}",
        getListMessageAdmin: serviceBase + "message/listMessageAdmin?moduleId={0}&areaId={1}&messageId={2}&keyWord={3}&scroll={4}",
        create: serviceBase + "message/create",
        getListOfArea: serviceBase + "message/getListOfArea",
        deleteMessages: serviceBase + "Message/Delete"
    },
    notification: {
        getTopNotification: serviceBase + "notification/Top",
        getListNotification: serviceBase + "notification/List",
        getCountNotification: serviceBase + "notification/Count",
        getCountUnreadNotification: serviceBase + "notification/CountUnRead",
        markAsAllReadNotification: serviceBase + "notification/MarkAsAllRead",
        markAsReadNotification: serviceBase + "notification/MarkAsRead"
    },
    uploadGroupKey: {
        temporay: "Temporay",
        swift: "SWIFT",
        specialStandingInstruction: "SpecialStandingInstruction"
    },
    viewFile: {
        fileSce: serviceBase + "sce/{0}/viewfile/{1}?token={2}",
        checkExistFileSce: serviceBase + "sce/checkExistFileSce/{0}"
    },
    utils: {
        getIp: serviceBase + "ip/getIp"
    }
});