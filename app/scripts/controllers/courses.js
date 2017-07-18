'use strict';

/**
 * @ngdoc function
 * @name botbloqItsFrontendApp.controller:CoursesCtrl
 * @description
 * # CoursesCtrl
 * Controller of the botbloqItsFrontendApp
 */

   botBloqApp.controller('coursesCtrl',function($log,$q,$scope,$http,$location,$timeout,coursesApi,usersApi,lomsApi,common) {
        $log.log('courses ctrl start');
        $scope.changeInit(false); 
    
        $scope.activeUser=common.activeUSer;
        $scope.enrolledCourses=[];
        $scope.doneCourses=[];

        $scope.totalCoursesPage=true;
        $scope.enrolledCoursesPage=false;
        $scope.coursePage=false;
        $scope.objectivesPage=false;
        $scope.completedCoursesPage=false;

        $scope.courseSelected=common.courseSelected;
        $scope.objectivesCourseSelected=common.objectivesCourseSelected;
        $scope.sectionsSelected=common.sectionsCourseSelected;
        $scope.lessonsSelected=common.lessonsCourseSelected;
        $scope.lessonSelected=common.lessonSelected;
        $scope.indexLessonSelected=common.indexLessonSelected;

        $scope.sections=[];
        $scope.lesson=[];
        // --- EDIT COURSE ---
        $scope.editCourseName=common.courseSelected.name;
        $scope.editCourseCode=common.courseSelected.code;
        $scope.editCourseSummary=common.courseSelected.summary;

        $scope.editCourseObjectives=common.sectionsCourseSelected[0];
        $scope.editSections=common.sectionsCourseSelected[0];

        // --- END EDIT COURSE ---
        
        $scope.lomsAux=[];
        $scope.lomsToAdd=[];
        $scope.listAuxLomsAdd=[];
        $scope.listAuxLomsRemove=[];

        $scope.InfoCourse=false;
        $scope.idItemToEdit;
        $scope.showFieldsGeneral=true;
        $scope.showFieldsObjectives=true;
        $scope.showFieldsSections=true;
        $scope.showFieldsSectionsObj=true;
        $scope.showFieldsSectionsLesson=true;
        $scope.showFieldsSectionsLessonObj=true;

        $scope.newObjective=true;
        $scope.newSection=true;
        $scope.newLesson=true;
        $scope.showSelectLoms=false;

        $scope.viewCoursesInfo=false;

        $scope.objectives={};
        $scope.sectionObj={};
        $scope.lessonObj={};

        var objectivesCourse=[],
            objectivesSection=[],
            objectivesLesson=[];

        var actualCourseToAdd={};
        var actualSection={};

        lomsApi.getLoms().then(function(response){
                $scope.loms= response.data;
                angular.forEach($scope.loms, function(element) {
                    $scope.lomsAux.push(element);
                });
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
        });

        $scope.updateLomsAux= function(){
            $scope.lomsAux=[];
            lomsApi.getLoms().then(function(response){
                $scope.loms= response.data;
                angular.forEach($scope.loms, function(element) {
                    $scope.lomsAux.push(element);
                });
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            });
        };

        coursesApi.getCourses().then(function(response){
                $scope.courses= response.data;
                if($scope.courses.length>0)
                    actualCourseToAdd=$scope.courses[$scope.courses.length -1];
                if (actualCourseToAdd.sections.length >0)
                    $scope.updateActualSections(actualCourseToAdd._id);
                console.log('actualCourseToAdd: ',actualCourseToAdd);
                console.log('actualSection: ',actualSection);
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
        }); 

        var navegationCourses= function(){

        };

        $scope.updateCourses= function() {
            console.log('loading Courses ...');
            coursesApi.getCourses().then(function(response){
                $scope.courses= response.data;        
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            }); 
        };
        $scope.updateLastCourse= function() {
            console.log('loading Courses ...');
            coursesApi.getCourses().then(function(response){
                $scope.courses= response.data; 
                common.courseSelected=$scope.courses[$scope.courses.length -1];         
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            }); 
        };
        $scope.updateSections= function(idCourse) {
            console.log('loading Sections ...');
            coursesApi.getSections(idCourse).then(function(response){
                    $scope.sections= response.data;
                    $scope.sectionsSelected=$scope.sections;
                    actualSection=$scope.sections[$scope.sections.length -1];
                    console.log("numero de secciones actuales: "+$scope.sections.length);
                }, function myError(err) {
                    console.log(err);
                    alert('Error de tipo: '+err.status);      
            });
        };
        $scope.updateActualSections= function(idCourse) {
            var sections=[];
            coursesApi.getSections(idCourse).then(function(response){
                    sections= response.data;
                    actualSection=sections[sections.length -1];
                }, function myError(err) {
                    console.log(err);
                    alert('Error de tipo: '+err.status);      
            });
        };
       
        var updateSectionsSelected= function(idCourse){
            var defered = $q.defer(),
                promise = defered.promise;
            coursesApi.getSections(idCourse).then(function(response){
                    common.sectionsCourseSelected=response.data;
                    console.log('numero de secciones en getSections dentro: ', common.sectionsCourseSelected.length);
                    defered.resolve();
                }, function myError(err) {
                    console.log(err);
                    alert('Error de tipo: '+err.status);      
            });
            return promise;
        };

        var updateLessonsSelected= function(idCourse,section){
            var defered = $q.defer(),
                promise = defered.promise,
                lessonsSection={};
            coursesApi.getLessons(idCourse,section).then(function(response){
                lessonsSection= response.data;
                angular.forEach(lessonsSection,function(lesson){
                    common.lessonsCourseSelected.push(lesson);
                });
                console.log('numero de lecciones en getLessons dentro: ', common.sectionsCourseSelected.length);
                defered.resolve();
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            });
            
            return promise;
        };

        
        $scope.showHideFields= function(fieldset) {
            if (fieldset==1){
                if($scope.showFieldsGeneral) $scope.showFieldsGeneral=false;
                else $scope.showFieldsGeneral=true;
            }else if(fieldset==2){
                if($scope.showFieldsObjectives) $scope.showFieldsObjectives=false;
                else $scope.showFieldsObjectives=true;
            }else if(fieldset==3){
                if($scope.showFieldsSections) $scope.showFieldsSections=false;
                else $scope.showFieldsSections=true;
            }else if(fieldset==4){
                if($scope.showFieldsSectionsObj) $scope.showFieldsSectionsObj=false;
                else $scope.showFieldsSectionsObj=true;
            }else if(fieldset==5){
                if($scope.showFieldsSectionsLesson) $scope.showFieldsSectionsLesson=false;
                else $scope.showFieldsSectionsLesson=true;
            }else if(fieldset==6){
                if($scope.showFieldsSectionsLessonObj) $scope.showFieldsSectionsLessonObj=false;
                else $scope.showFieldsSectionsLessonObj=true;
            }
        };

        $scope.showInfoCourse = function(item){
            $scope.InfoCourse=true;
            console.log('loading get info courses ...');
            coursesApi.getCourse(item).then(function(response){
                $scope.courseName=response.data.name;
                $scope.courseCode=response.data.code;
                $scope.courseSummary=response.data.summary;
                $scope.objectives=response.data.objetives;
                $scope.sections=response.data.sections;
                $scope.courseHistory=response.data.history;
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            });
        };
        $scope.hideInfoCourse = function(){
            $scope.InfoCourse=false;
        };
        $scope.showAddCourseForm = function() {
            $scope.showCoursesForm=true;
            $scope.edit=false;
        };
        $scope.showEditCourseForm = function(item) {
            $scope.showCoursesForm=true;
            $scope.edit=true;
            $scope.idItemToEdit=item._id;

            $scope.courseName=item.name;
            $scope.courseCode=item.code;
            $scope.courseSummary=item.summary;
            $scope.objectives=item.objetives;
            $scope.sections=item.sections;
            $scope.courseHistory=item.history;
        };
        $scope.goEditCourse = function(item) {
            common.courseSelected=item;
            common.objectivesCourseSelected=item.objectives;
            common.sectionsCourseSelected=item.sections;
            $location.path("/editCourse");
            console.log('edicion de ',common.courseSelected.name);
            /*resetCourseSelected();
            var promise=updateSectionsSelected(item._id);
            promise.then(function() {
                console.log('numero de secciones en goCourse: ', common.sectionsCourseSelected.length);
                $scope.sectionsSelected=common.sectionsCourseSelected;
                $location.path("/editCourse");
            }, function(error) {
                console.log('Se ha producido un error al obtener el dato: '+error);     
            });*/

        
            $scope.editObjectives=item.objetives;
           
            $scope.editSections=item.sections;
            $scope.editCourseHistory=item.history;
            $scope.showCoursesForm=true;
            $scope.edit=true;
            $scope.idItemToEdit=item._id;

        };
        $scope.goAddCourse= function(){
            $location.path("/addCourse");
        };
        $scope.viewCourseWithInfo= function(){
             $scope.viewCoursesInfo=true;
        };
        $scope.viewCourseWithoutInfo= function(){
             $scope.viewCoursesInfo=false;
        };
        $scope.showNewObjective=function(){
            $scope.newObjective=true;
        };
        $scope.showNewSection=function(){
            $scope.newSection=true;
        };
        $scope.showNewLesson=function(){
            $scope.newLesson=true;
        };
        $scope.finAddCourse=function(){
            $location.path("/courses");
            $scope.updateCourses();
        };
        $scope.finAddObjectives=function(){
            $location.path("/addSections");
        };
        $scope.finNewObjective=function(){
            $scope.newObjective=false;
        };
        $scope.finAddLesson=function(){
            $location.path("/addSections");
        };


        $scope.addEditCourse = function() {
            console.log('valor de edit: ', $scope.edit);
            if($scope.edit) $scope.editCourse($scope.idItemToEdit);
            else $scope.addCourse();
        };

        $scope.addNewObjective=function(breadCrumb){
            switch (breadCrumb) {
                case 1:
                    objectivesCourse.push($scope.objectives);
                    $scope.objectives={};
                    break;
                case 2:
                    objectivesSection.push($scope.sectionObj);
                    $scope.sectionObj={};
                    break;
                case 3:
                    objectivesLesson.push($scope.lessonObj);
                    $scope.lessonObj={};
                    break;
                default:
            }
            $scope.newObjective=false;
        };
        $scope.addObjectiveEdit=function(breadCrumb,section,lesson,objSection,objLesson){
            console.log('datos para addObjective: ',section,lesson);
            var newObjectives=[];
            switch (breadCrumb) {
                case 1:
                    newObjectives.push($scope.objectives);
                    common.objectivesCourseSelected.push($scope.objectives);
                    coursesApi.addObjectivesToCourse(common.courseSelected._id,newObjectives).then(function(response) {
                        console.log('ok después añadir objetivo a curso en editar curso', response);
                        $scope.updateCourses(); 
                        $scope.objectives={};
                    }, function(error) {
                        $console.log('ERROR después añadir objetivo a curso en editar curso', error);      
                    });         
                    break;
                case 2:
                    newObjectives.push($scope.sectionObj);
                    objectivesSection.push($scope.sectionObj);
                    objSection.push($scope.sectionObj);
                    coursesApi.addObjectivesToSection(common.courseSelected._id,section,newObjectives).then(function(response) {
                        console.log('ok después añadir objetivo a sección en editar curso', response);
                        $scope.updateCourses(); 
                        $scope.sectionObj={};
                    }, function(error) {
                        $console.log('ERROR después añadir objetivo a sección en editar curso', error);      
                    });
                    break;
                case 3:
                    newObjectives.push($scope.lessonObj);
                    objectivesLesson.push($scope.lessonObj);
                    objLesson.push($scope.lessonObj);
                    coursesApi.addObjectivesToLesson(common.courseSelected._id,section,lesson,newObjectives).then(function(response) {
                        console.log('ok después añadir objetivo a lección en editar curso', response);
                        $scope.updateCourses(); 
                        $scope.lessonObj={};
                    }, function(error) {
                        $console.log('ERROR después añadir objetivo a lección en editar curso', error);      
                    });
                    break;
                default:
            }
            $scope.newObjective=false;
        };

        $scope.hideSelectLoms= function(){
            $scope.selectLoms=true;
        };

        $scope.addCourse = function() {
            if ($scope.adminCoursesForm.$valid) {
                console.log('adding...');
                coursesApi.addCourse($scope.courseName,$scope.courseCode,$scope.courseSummary, objectivesCourse).then(function(response) {
                    console.log('ok después de addCourse', response);
                    $scope.updateLastCourse();
                    common.courseSelected=$scope.courses[$scope.courses.length -1];
                    $location.path("/addSections");
                }, function(error) {
                    console.log('error después de addCourse', error);
                });
                $scope.showCoursesForm=false;
            } else {
                console.log('There are invalid fields');
            }
            objectivesCourse=[];
        };

        $scope.addSection=function(){
            if ($scope.adminCoursesFormSection.$valid) {
                console.log('parametros addSection: ',common.courseSelected._id, $scope.sections.name, $scope.sections.summary,objectivesSection);
                coursesApi.addSection(common.courseSelected._id, $scope.sections.name, $scope.sections.summary,objectivesSection).then(function(response) {
                    console.log('ok después de addSection', response);
                    $scope.updateSections(common.courseSelected._id);
                    $location.path("/addLessons");
                }, function(error) {
                    console.log('error después de addSection', error);
                });
            } else {
                console.log('There are invalid fields');
            }
            objectivesSection=[];
        };
        $scope.addSectionEdit=function(){
            /*if ($scope.adminCoursesFormSection.$valid || $scope.addSectionEdit) {*/
                console.log('parametros addSection (EDIT): ',common.courseSelected._id, $scope.sections.name, $scope.sections.summary,objectivesSection);
                coursesApi.addSection(common.courseSelected._id, $scope.sections.name, $scope.sections.summary,objectivesSection).then(function(response) {
                    console.log('ok después de addSection', response);
                    $scope.updateSections(common.courseSelected._id);
                }, function(error) {
                    console.log('error después de addSection', error);
                });
            /*} else {*/
                /*console.log('There are invalid fields');*/
           /* }*/
                objectivesSection=[];
        };
        $scope.addLesson=function(){
            if ($scope.adminCoursesFormSectionLesson.$valid) {
                coursesApi.addLesson(actualCourseToAdd._id,actualSection.name, $scope.lesson.name, $scope.lesson.summary,objectivesLesson, $scope.lesson.learningPath, $scope.lesson.type).then(function(response) {
                    $scope.assignLomsToLesson(actualCourseToAdd._id,actualSection.name,$scope.lesson.name,$scope.lomsToAdd);
                    $scope.resetLesson();
                }, function(error) {
                    console.log('error después de addSection', error);
                });
            } else {
                console.log('There are invalid fields');
            }  
        };
        $scope.addLessonEdit=function(section){
            /*if ($scope.adminCoursesFormSectionLesson.$valid) {*/
                coursesApi.addLesson(common.courseSelected._id,section, $scope.lesson.name, $scope.lesson.summary,objectivesLesson, $scope.lesson.learningPath, $scope.lesson.type).then(function(response) {
                    $scope.assignLomsToLesson(common.courseSelected._id,section,$scope.lesson.name,$scope.lomsToAdd);
                    $scope.resetLesson();
                }, function(error) {
                    console.log('error después de addSection', error);
                });
            /*} else {*/
                console.log('There are invalid fields');
            /*}  */
        };

        $scope.resetLesson=function(){
            $scope.newLesson=false;
            $scope.newObjective=true;
            $scope.showSelectLoms=false;
            $scope.lesson=[];
            objectivesLesson=[];
            $scope.updateLomsAux(); 
            $scope.lomsToAdd=[];
        };

        $scope.asignLomToLesson=function(idCourse,section,lesson, lom){
            console.log('--- metodo que asigna un lom a una lección----');
            coursesApi.asignLomLesson(idCourse,section,lesson,lom._id).then(function(response) {
                    console.log('ok después de asignar el lom cuyo id es '+lom._id+' a una lección', response);
                    console.log('    -----    '); 
                }, function(error) {
                     console.log('error después de asignación de lom a una lección', error);
            }); 
        };
        $scope.assignLomsToLesson=function(idCourse,section,lesson, loms){
            console.log('--- metodo que asigna una lista de loms a una lección ----');
            console.log('Numero de loms para asignar: '+loms.length);
            var listIdLoms= $scope.listIdLoms(loms);
            coursesApi.assignLomsLesson(idCourse,section,lesson,listIdLoms).then(function(response) {
                    console.log('ok después de asignar la lista de '+listIdLoms.length+' loms a una lección', response);
                    console.log('    -----    '); 
                }, function(error) {
                     console.log('error después de asignación de lom a una lección', error);
            });
        };

        $scope.listIdLoms=function(listLoms){
            var listIdLoms=[];
            angular.forEach(listLoms,function(element){
                listIdLoms.push(element._id);
            });
            return listIdLoms;
        };
        $scope.calcNumLessons = function(course){
            var sections={};
            sections=coursesApi.getSections(course._id);
            var numLessons=0;
            angular.forEach(sections,function(section){
                numLessons= numLessons + section.lessons.length;
            });
            return numLessons;
        };
    
        $scope.deleteItemFromList=function(list,item){
            var listt=[];
            return listt=list.filter(function(element) {
                return element!== item;
            });
        };

        $scope.addToListAux=function(lom,active){
            if(active){
                $scope.listAuxLomsAdd.push(lom);
            }    
            else{
                $scope.listAuxLomsAdd=$scope.listAuxLomsAdd.filter(function(element) {
                    return element!== lom;
                });
            }
        };
        $scope.addToListAdd=function($event){
            $event.preventDefault();
            angular.forEach($scope.listAuxLomsAdd, function(element) {
                $scope.lomsAux=$scope.lomsAux.filter(function(el) {
                    return el!== element;
                }); 
                $scope.lomsToAdd.push(element);
            });
            $scope.listAuxLomsAdd=[];
        };
        $scope.addToListEditLom=function(section,lesson,$event){
            $event.preventDefault();
            var lomsToAdd=[];
            angular.forEach($scope.listAuxLomsAdd, function(element) {
                lomsToAdd.push(element);
            });
            $scope.listAuxLomsAdd=[];
            coursesApi.assignLomsLesson(common.courseSelected._id,section,lesson,lomsToAdd).then(function(response) {
                    console.log('ok después de asignar la lista de '+lomsToAdd.length+' loms a una lección', response);
                    console.log('    -----    '); 
                }, function(error) {
                     console.log('error después de asignación de lom a una lección', error);
            });
        };
        $scope.deleteFromListEditLom=function(section,lesson,$event){
            $event.preventDefault();
            var lomsToDelete=[];
            angular.forEach($scope.listAuxLomsRemove, function(element) {
                lomsToDelete.push(element);
            });
            $scope.listAuxLomsAdd=[];
            lomsApi.removeLomsOfLesson(common.courseSelected._id,section,lesson,lomsToDelete).then(function(response) {
                    console.log('ok después eliminar loms de una lección', response);
                    console.log('    -----    '); 
                }, function(error) {
                     console.log('error después de asignación de lom a una lección', error);
            });
        };

        $scope.removeFromListAux=function(lom,active){
            if(active){
                $scope.listAuxLomsRemove.push(lom);
            }    
            else{
                $scope.listAuxLomsRemove=$scope.listAuxLomsRemove.filter(function(element) {
                    return element!== lom;
                });
            }
        };
        $scope.removeLomsFromListAdd=function($event){
            $event.preventDefault();
            angular.forEach($scope.listAuxLomsRemove, function(element) {
                $scope.lomsToAdd=$scope.lomsToAdd.filter(function(el) {
                    return el!== element;
                }); 
                $scope.lomsAux.push(element);
            });
            $scope.listAuxLomsRemove=[];
        };
        $scope.removeLomFromListAdd=function(lom){
            $scope.lomsToAdd=$scope.lomsToAdd.filter(function(element) {
                return element!== lom;
            }); 
            $scope.lomsAux.push(lom);
        };

        $scope.editCourse = function(courseName, courseCode, courseSummary,objs) {
            if ($scope.coursesEditForm.$valid ) {
                console.log('editing...');
                console.log("parametros de entrada: ",common.courseSelected._id,courseName,courseCode,courseSummary,objs);
                coursesApi.editCourse(common.courseSelected._id,courseName,courseCode,courseSummary,common.objectivesCourseSelected).then(function(response) {
                    console.log('ok después de editCourse', response);
                    $scope.updateCourses();
                    confirm("Curso editado con éxito!");
                    $location.path("/courses");
                }, function(error) {
                    console.log('error después de editCourse', error);
                    confirm("Error al editar el curso.");
                });
                $scope.showCoursesForm=false;
            } else {
                console.log('There are invalid fields');
            }
            $scope.courseName='';
            $scope.courseCode='';
            $scope.courseSummary='';
            $scope.objectives={};
            $scope.sections={};
            $scope.courseHistory='';
        };
        $scope.editSection = function(index,newSectionsName, sectionsSummary, sectionsObjectives,sectionsLessons) {
            console.log('editing section ...');
            var sections=[],sectionName="";
            var defered = $q.defer(),
                promise = defered.promise;
            coursesApi.getSections(common.courseSelected._id).then(function(response){
                sections=response.data;
                sectionName=sections[index].name;
                console.log("(GET SECTIONS) sections de "+common.courseSelected._id+": "+sections.length);
                defered.resolve();
                console.log('anterior nombre de seccion: ',sectionName);
                console.log('objetos para editar ',sectionName,newSectionsName,sectionsSummary,sectionsObjectives,sectionsLessons);
                coursesApi.editSection(common.courseSelected._id,sectionName,newSectionsName,sectionsSummary,sectionsObjectives,sectionsLessons).then(function(response) {
                    console.log('ok después de editSection', response);
                    confirm("Sección editada con éxito!");
                }, function(error) {
                    console.log('error después de editSection', error);
                    confirm("Error al editar la sección.");
                });
                $scope.showCoursesForm=false;
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            });    
        };

        $scope.removeCourse = function(course,e){
            console.log('eliminado course con id: ', course);
            if (confirm("¿SEGURO QUE QUIERE ELIMINAR ESTE CURSO?") === false) {
                e.preventDefault();
                return;
            }
            coursesApi.removeItem(course._id).then(function(response) {
                    console.log('eliminado course con exito', response);
                    $scope.updateCourses();
                }, function(error) {
                    console.log('error al eliminar course', error);
             });
        };
        $scope.deleteAllCourses = function(e){
            console.log('eliminado courses');
            if (confirm("¿ESTÁ DISPUESTO A ELIMINAR TODOS LOS CURSOS?") === false) {
                e.preventDefault();
                return;
            }
            coursesApi.removeAllItem().then(function(response) {
                    console.log('eliminado todos los items con exito', response);
                }, function(error) {
                    console.log('error al eliminar todos los items', error);
             });
        };

        $scope.goCourse=function(course){
            common.courseSelected= course;
            $scope.courseSelected=course;
            resetCourseSelected();
            var promise=updateSectionsSelected(course._id);
            promise.then(function() {
                console.log('numero de secciones en goCourse: ', common.sectionsCourseSelected.length);
                calculateNumLessons(course._id);
            }, function(error) {
                console.log('Se ha producido un error al obtener el dato: '+error);     
            });
            $scope.coursePage=true;
            $scope.totalCoursesPage=false;
            $scope.enrolledCoursesPage=false;
            $scope.objectivesPage=false;
        };

        var calculateNumLessons=function(idCourse){
            angular.forEach(common.sectionsCourseSelected,function(section){
                updateLessonsSelected(idCourse,section.name);
            });
        };
        var resetCourseSelected=function(){
            common.sectionsCourseSelected=[];
            common.lessonsCourseSelected=[];
            $scope.sectionsSelected=common.sectionsCourseSelected;
            $scope.lessonsSelected=common.lessonsCourseSelected;
        };
        var searchCourse= function(id){
            var courseSelected=null;
            angular.forEach($scope.courses, function(element) {
                if(element._id==id){
                    courseSelected=element;
                }
            });
            return courseSelected;
        };

        $scope.showEnrolledCourses=function(){
            $scope.totalCoursesPage=false;
            $scope.enrolledCoursesPage=true;
            $scope.coursePage=false;
            $scope.objectivesPage=false;
            $scope.completedCoursesPage=false;
            $scope.getStudentsCoursesActives($scope.activeUser._id);
            //$scope.getAllStudentsCourses($scope.activeUser._id);
            //$scope.getStudentsCoursesUnfinished($scope.activeUser._id);
            //$scope.getStudentsCoursesFinished($scope.activeUser._id);
        };
        $scope.showCompletedCourses=function(){
            $scope.totalCoursesPage=false;
            $scope.enrolledCoursesPage=false;
            $scope.coursePage=false;
            $scope.objectivesPage=false;
            $scope.completedCoursesPage=true;
            $scope.getStudentsCoursesActives($scope.activeUser._id);
            //$scope.getAllStudentsCourses($scope.activeUser._id);
            //$scope.getStudentsCoursesUnfinished($scope.activeUser._id);
            //$scope.getStudentsCoursesFinished($scope.activeUser._id);
        };

        $scope.showTotalCourses=function(){
            $scope.totalCoursesPage=true;
            $scope.enrolledCoursesPage=false;
            $scope.coursePage=false;
            $scope.objectivesPage=false;
        };

        // ----------------    STUDENT  ---------------
        $scope.assignStudentToGroup=function(idStudent){
            console.log('Asignando estudiante a grupo ...');
            usersApi.assignStudentToGroup(idStudent).then(function(response){
                console.log('Estudiante asignado correctamente ...'); 
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            });
        };

        $scope.enrollStudent=function(idStudent,idCourse){
            console.log('Matriculando a alumno ...');
            usersApi.enrollStudent(idStudent,idCourse).then(function(response) {       
                confirm("MATRICULADO CON ÉXITO !!");
                console.log('ok después de enrollStudent', response);
            }, function(error) {
                confirm("ERROR AL MATRICULARSE A ESTE CURSO !!");
                console.log('error después de enrollStudent', error);
            });   
        };

        $scope.goLesson= function(lesson,index){
            console.log('Go Lesson ---------',common.activeUSer._id,common.courseSelected._id);
            usersApi.getActivityLesson(common.activeUSer._id,common.courseSelected._id).then(function(response){
                console.log('Get de actividad de estudiante: '+common.activeUSer._id+' en curso: '+common.courseSelected._id);
                console.log('----------------ACTIVIDAD: ',response.data);  
                common.lessonSelected=lesson;
                $scope.lessonSelected=common.lessonSelected;
                common.indexLessonSelected=index;
                $scope.indexLessonSelected=common.indexLessonSelected;
                $location.path("/lesson");      
            }, function myError(err) {
                console.log(err);      
            });
        }

        $scope.getStudentsCoursesActives= function(idStudent) {
            console.log('loading cursos activos ...');
            /*coursesApi.getStudentsCoursesActives(idStudent).then(function(response){
                $scope.enrolledCourses= response.data;          
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            });*/ 
            $scope.enrolledCourses=$scope.activeUser.course[0];
        };
        $scope.getStudentsCoursesFinished= function(idStudent) {
            console.log('loading cursos terminados ...');
            coursesApi.getStudentsCoursesFinished(idStudent).then(function(response){
                $scope.doneCourses= response.data;          
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            }); 
        };
        $scope.getStudentsCoursesUnfinished= function(idStudent) {
            console.log('loading cursos inacabados ...');
            coursesApi.getStudentsCoursesUnfinished(idStudent).then(function(response){
                $scope.enrolledCourses= response.data;          
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            }); 
        };
        $scope.getAllStudentsCourses= function(idStudent) {
            console.log('loading todos los cursos ...');
            coursesApi.getAllStudentsCourses(idStudent).then(function(response){
                $scope.enrolledCourses= response.data;          
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            }); 
        };
        

         // ----------------    FIN STUDENT METHODS ---------------

        // -------------- LOAD IMAGES METHODS ---------------------
        $scope.thumbnail = {
            dataUrl: common.bitbloqBackendUrladsfas
        };
        $scope.fileReaderSupported = window.FileReader != null;
        $scope.photoChanged = function(files){
            if (files != null) {
                var file = files[0];
                if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                    $timeout(function() {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function(e) {
                            $timeout(function(){
                                $scope.thumbnail.dataUrl = e.target.result;
                            });
                        }
                    });
                }
            }
        };
        // 

    });