'use strict';

/**
 * @ngdoc service
 * @name botbloqItsFrontendApp.coursesApi
 * @description
 * # coursesApi
 * Service in the bitbloqApp.
 */
botBloqApp.service('coursesApi', function($log, $q, $http, common) {

        $log.log('coursesApi start');

        function addCourse(courseName,courseCode,courseSummary, obj) {
            $log.debug("Objetos para hacer post course: "+ courseName,courseCode,courseSummary,obj);

            var coursesPromise = $q.defer();

            $http.post(common.bitbloqBackendUrl + '/courses/', {
                name: courseName,
                code: courseCode,
                summary: courseSummary,
                objectives: obj,
                statistics:  {},
                history: ''
            }).then(function(response) {
                $log.debug('ok despues de post course', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 $log.debug('error despues de post course',err);
            });
            return coursesPromise.promise;
        }
        function addSection(idCourse, sectionsName,sectionsSummary,sectionsObjectives) {
            $log.debug("Objetos para hacer post section: "+ idCourse, sectionsName,sectionsSummary,sectionsObjectives);

            var coursesPromise = $q.defer();

            $http.post(common.bitbloqBackendUrl + '/courses/'+idCourse, { 
                name: sectionsName,
                summary: sectionsSummary,
                objectives:sectionsObjectives
            }).then(function(response) {
                $log.debug('ok despues de post section', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 $log.debug('error despues de post section',err);
            });
            return coursesPromise.promise;
        }

        function addLesson(idCourse, section, lessonName,lessonSummary,lessonObjectives, learningPath, lessonType) {
            $log.debug("Objetos para hacer post lesson: "+ idCourse,section,lessonName,lessonSummary,lessonObjectives,learningPath,lessonType);

            var coursesPromise = $q.defer();

            $http.post(common.bitbloqBackendUrl + '/courses/'+idCourse+'/section/'+section, { 
                name:lessonName, 
                summary: lessonSummary ,  
                objectives: lessonObjectives,  
                learning_path: learningPath,
                type: lessonType,
                loms:[]
            }).then(function(response) {
                $log.debug('ok despues de post lesson', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 $log.debug('error despues de post lesson',err);
            });
            return coursesPromise.promise;
        }

        function asignLomLesson(idCourse,section,lesson,idLom) { 
            var coursesPromise = $q.defer();
            $log.debug("Objetos para hacer post asign lom: "+ idCourse,section,lesson,idLom);
            $http.post(common.bitbloqBackendUrl + '/courses/'+idCourse+'/section/'+section+'/lesson/'+lesson+'/lom/'+idLom, {
                }).then(function(response) {
                    $log.debug('ok despues de asignar un lom '+idLom+' a una leccion', response.data.token);
                    coursesPromise.resolve();  
                }, function(err) {
                     $log.debug('error despues intentar asignar el lom '+idLom+' a una leccion',err);
                });
            return coursesPromise.promise;     
        }

        function asignLomsLesson(idCourse,section,lesson,listLoms) { 
            var coursesPromise = $q.defer();
            $log.debug("Objetos para hacer post asign lom: "+ idCourse,section,lesson,listLoms);
            $http.post(common.bitbloqBackendUrl + '/courses/'+idCourse+'/section/'+section+'/lesson/'+lesson+'/asign_loms', 
              listLoms
                ).then(function(response) {
                    $log.debug('ok despues de asignar una lista de '+listLoms.length+' loms a una leccion', response.data.token);
                    coursesPromise.resolve();  
                }, function(err) {
                     $log.debug('error despues intentar asignar la lista de loms a una leccion',err);
            });
            return coursesPromise.promise;     
        }
        
        function editCourse(idItem,courseName,courseCode,courseSummary,objectives, statistics, courseHistory) {
            $log.debug("Objetos para editar: "+ courseName,courseCode,courseSummary,
                                 objectives, statistics, courseHistory);

            var coursesPromise = $q.defer();
            $log.debug('id de item a editar (antes de llamada)', idItem);
            $http.put(common.bitbloqBackendUrl + '/courses/'+idItem, {
                name: courseName,
                code: courseCode,
                summary: courseSummary,
                objectives: {
                    code: objectives.code,
                    description: objectives.description,
                    level: objectives.level,
                    bloom: objectives.bloom
                },
                statistics: {
                    std_enrolled: statistics.std_enrolled,
                    std_finished: statistics.std_finished,
                    std_unenrolled: statistics.std_unenrolled     
                },
                history: courseHistory
            }).then(function(response) {
                $log.debug('ok despues de editar-post', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 $log.debug('error despues de editar-post',err);
            });
            return coursesPromise.promise;
        }

        function getCourses() { 
          return $http.get( common.bitbloqBackendUrl + "/courses/" );      
        }
        function getCourse(idCourse) { 
          return $http.get( common.bitbloqBackendUrl + "/courses/"+idCourse._id );      
        }
        function getSections(idCourse) { 
          return $http.get( common.bitbloqBackendUrl + "/courses/"+idCourse+"/sections" );      
        }
        function getSection(idCourse,section) { 
          return $http.get( common.bitbloqBackendUrl + "/courses/"+idCourse+"/section/"+section);      
        }
        function getLessons(idCourse,section) { 
          return $http.get( common.bitbloqBackendUrl + "/courses/"+idCourse+"/section/"+section+"/lessons");      
        }
        function removeItem(idCourse) { 
          return $http.delete(common.bitbloqBackendUrl + "/courses/"+idCourse);      
        }
        function removeAllItem() { 
          return $http.delete(common.bitbloqBackendUrl + "/courses");      
        }
       
        var exports = {
            addCourse : addCourse,
            getCourses : getCourses,
            getSections :getSections,
            getSection :getSection,
            getCourse : getCourse,
            getLessons: getLessons,
            removeItem : removeItem,
            removeAllItem : removeAllItem,
            editCourse : editCourse,
            asignLomsLesson : asignLomsLesson,
            addSection : addSection,
            addLesson : addLesson
        };

        return exports;

    });