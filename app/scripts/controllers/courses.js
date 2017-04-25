'use strict';

/**
 * @ngdoc function
 * @name botbloqItsFrontendApp.controller:CoursesCtrl
 * @description
 * # CoursesCtrl
 * Controller of the botbloqItsFrontendApp
 */

   botBloqApp.controller('coursesCtrl',
                         function($log, $scope,$http,$location,coursesApi, lomsApi) {
        $log.log('courses ctrl start');
        
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

        $scope.objectives={};
        $scope.sectionObj={};
        $scope.lessonObj={};

        var objectivesCourse=[],
            objectivesSection=[],
            objectivesLesson=[];

        var idActualCourse;
        var actualSection;

        lomsApi.getLoms().then(function(response){
                $scope.loms= response.data;
                angular.forEach($scope.loms, function(element) {
                    $scope.lomsAux.push(element);
                });
            }, function myError(err) {
                $log.debug(err);
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
                $log.debug(err);
                alert('Error de tipo: '+err.status);      
            });
        };

        coursesApi.getCourses().then(function(response){
                $scope.courses= response.data;
                if($scope.courses.length>0)
                    idActualCourse=$scope.courses[$scope.courses.length -1]._id;
                if ($scope.courses[$scope.courses.length -1].sections.length >0)
                    $scope.showSections(idActualCourse);
            }, function myError(err) {
                $log.debug(err);
                alert('Error de tipo: '+err.status);      
        }); 

        
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

        $scope.updateCourses= function() {
            $log.debug('loading Courses ...');
            coursesApi.getCourses().then(function(response){
                $scope.courses= response.data;          
            }, function myError(err) {
                $log.debug(err);
                alert('Error de tipo: '+err.status);      
            }); 
        };
        $scope.showSections= function(idCourse) {
            $log.debug('loading Sections ...');
            coursesApi.getSections(idCourse).then(function(response){
                    $scope.sections= response.data;
                    actualSection=$scope.sections[$scope.sections.length -1];
                    $log.debug("numero de secciones actuales: "+$scope.sections.length);
                }, function myError(err) {
                    $log.debug(err);
                    alert('Error de tipo: '+err.status);      
            });
        };

        $scope.showInfoCourse = function(item){
            $scope.InfoCourse=true;
            $log.debug('loading get info courses ...');
            coursesApi.getCourse(item).then(function(response){
                $scope.courseName=response.data.name;
                $scope.courseCode=response.data.code;
                $scope.courseSummary=response.data.summary;
                $scope.objectives=response.data.objetives;
                $scope.sections=response.data.sections;
                $scope.courseHistory=response.data.history;
            }, function myError(err) {
                $log.debug(err);
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
        $scope.goAddCourse= function(){
            $location.path("/addCourse");
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
            $log.debug('valor de edit: ', $scope.edit);
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

        $scope.hideSelectLoms= function(){
            $scope.selectLoms=true;
        };

        $scope.addCourse = function() {
            if ($scope.adminCoursesForm.$valid) {
                $log.debug('adding...');
                coursesApi.addCourse($scope.courseName,$scope.courseCode,$scope.courseSummary, objectivesCourse).then(function(response) {
                    $log.debug('ok después de addCourse', response);
                    $scope.updateCourses();
                    $location.path("/addSections");
                }, function(error) {
                    $log.debug('error después de addCourse', error);
                });
                $scope.showCoursesForm=false;
            } else {
                $log.debug('There are invalid fields');
            }
            objectivesCourse=[];
        };

        $scope.addSection=function(){
            if ($scope.adminCoursesFormSection.$valid) {
                coursesApi.addSection(idActualCourse, $scope.sections.name, $scope.sections.summary,objectivesSection).then(function(response) {
                    $log.debug('ok después de addSection', response);
                    $scope.showSections(idActualCourse);
                    $location.path("/addLessons");
                }, function(error) {
                    $log.debug('error después de addSection', error);
                });
            } else {
                $log.debug('There are invalid fields');
            }
            objectivesSection=[];
        };
        $scope.addLesson=function(){
            if ($scope.adminCoursesFormSectionLesson.$valid) {
                coursesApi.addLesson(idActualCourse,actualSection.name, $scope.lesson.name, $scope.lesson.summary,objectivesLesson, $scope.lesson.learningPath, $scope.lesson.type).then(function(response) {
                    $scope.asignLomsToLesson(idActualCourse,actualSection.name,$scope.lesson.name,$scope.lomsToAdd);
                    $scope.resetLesson();
                }, function(error) {
                    $log.debug('error después de addSection', error);
                });
            } else {
                $log.debug('There are invalid fields');
            }  
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

        $scope.asignLomsToLesson=function(idCourse,section,lesson, loms){
            $log.debug('--- metodo asignLomsToLesson----');
            $log.debug('Numero de loms para asignar: '+loms.length);
            angular.forEach(loms, function(element) {
                coursesApi.asignLomsLesson(idCourse,section,lesson,element._id).then(function(response) {
                        $log.debug('ok después de asignar el lom '+element._id+' a una lección', response);
                        $log.debug('    -----    '); 
                    }, function(error) {
                         $log.debug('error después de asignación de lom a una lección', error);
                });
            });
            
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

        $scope.editCourse = function(idItem) {
            if ($scope.coursesForm.$valid) {
                $log.debug('editing...');
                coursesApi.editCourse(idItem,$scope.courseName,$scope.courseCode,$scope.courseSummary,$scope.objectives,$scope.sections,$scope.courseHistory).then(function(response) {
                    $log.debug('ok después de editCourse', response);
                    $scope.updateCourses();
                }, function(error) {
                    $log.debug('error después de editCourse', error);
                });
                $scope.showCoursesForm=false;
            } else {
                $log.debug('There are invalid fields');
            }
            $scope.courseName='';
            $scope.courseCode='';
            $scope.courseSummary='';
            $scope.objectives={};
            $scope.sections={};
            $scope.courseHistory='';
        };
        
        $scope.removeCourse = function(item){
            $log.debug('eliminado item con id: ', item);
            coursesApi.removeItem(item).then(function(response) {
                    $log.debug('eliminado item con exito', response);
                    $scope.updateCourses();
                }, function(error) {
                    $log.debug('error al eliminar item', error);
             });
        };
        $scope.deleteAllCourses = function(e){
            $log.debug('eliminado courses');
            if (confirm("¿ESTÁ DISPUESTO A ELIMINAR TODOS LOS CURSOS?") === false) {
                e.preventDefault();
                return;
            }
            coursesApi.removeAllItem().then(function(response) {
                    $log.debug('eliminado todos los items con exito', response);
                }, function(error) {
                    $log.debug('error al eliminar todos los items', error);
             });
        };
       
        
    });