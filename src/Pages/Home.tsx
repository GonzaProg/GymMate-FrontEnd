import { useState, useRef, Suspense, lazy } from "react";

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/pagination";

// Hooks y Componentes
import { useOptimizedHome } from "../Hooks/Home/useOptimizedHome";
import { useAlertasRecepcion } from "../Hooks/Asistencias/useAlertasRecepcion";
import { usePushNotifications } from "../Hooks/Notificaciones/usePushNotifications";
import { NavbarInferior } from "../Components/Mobile/NavbarInferior"; 
import { WhatsAppModal } from "../Components/WhatsApp/WhatsAppModal";
import { WhatsAppStatus } from "../Components/WhatsApp/WhatsAppStatus"; 
import { useUserPlan } from "../Hooks/Planes/useUserPlan";
import { AppStyles } from "../Styles/AppStyles";
import { BackgroundLayout } from "../Components/BackgroundLayout"; 
import { NavbarSuperior } from "../Components/Mobile/NavbarSuperior";
import { StatsGrid } from "../Components/Dashboard/StatsGrid";
import { CloudinaryApi } from "../Helpers/Cloudinary/Cloudinary";

// Pagina inicial de alumnos con plan expirado
import { ExpiredPlanPage } from "./StudentsHome/ExpiredPlanPage";

// IMPORTACIONES PEREZOSAS
const MyRoutines = lazy(() => import("./Rutinas/MyRoutines").then(module => ({ default: module.MyRoutines })));
const Profile = lazy(() => import("./Usuarios/Profile").then(module => ({ default: module.Profile })));

// Vistas de Admin (Lazy Loading)
const PlansManager = lazy(() => import("../Pages/Planes/PlansManager").then(module => ({ default: module.PlansManager })));
const CreateRoutine = lazy(() => import("../Pages/Rutinas/CreateRoutine").then(module => ({ default: module.CreateRoutine })));
const GeneralRoutinesManager = lazy(() => import("../Pages/Rutinas/GeneralRoutinesManager").then(module => ({ default: module.GeneralRoutinesManager })));
const EjerciciosGestion = lazy(() => import("../Pages/Ejercicios/EjerciciosGestion").then(module => ({ default: module.EjerciciosGestion })));
const EjerciciosCrear = lazy(() => import("../Pages/Ejercicios/EjerciciosCrear").then(module => ({ default: module.EjerciciosCrear })));
const CreateNotification = lazy(() => import("../Pages/Notificaciones/CreateNotification").then(module => ({ default: module.CreateNotification })));
const CreateUser = lazy(() => import("../Pages/Usuarios/CreateUser").then(module => ({ default: module.CreateUser })));
const UsersManager = lazy(() => import("../Pages/Usuarios/UsersManager").then(module => ({ default: module.UsersManager })));
const UserRoutinesManager = lazy(() => import("../Pages/Rutinas/UserRoutinesManager").then(module => ({ default: module.UserRoutinesManager })));
const SendRoutinePDF = lazy(() => import("../Pages/Rutinas/SendRoutinePDF").then(module => ({ default: module.SendRoutinePDF })));
const RenewPlan = lazy(() => import("../Pages/Planes/RenewPlan").then(module => ({ default: module.RenewPlan })));
const Preferences = lazy(() => import("../Pages/Config/Preferences").then(module => ({ default: module.Preferences })));
const CreateGym = lazy(() => import("../Pages/Gym/CreateGym").then(module => ({ default: module.CreateGym })));
const GymManagement = lazy(() => import("../Pages/Gym/GymManagement").then(module => ({ default: module.GymManagement })));
const ManualReceipt = lazy(() => import("../Pages/Planes/ReciboManual").then(module => ({ default: module.ManualReceipt })));
const MetricasFinancieras = lazy(() => import("./Pagos/MetricasFinancieras").then(module => ({ default: module.MetricasFinancieras })));
const ProductosManager = lazy(() => import("../Pages/Productos/ProductosManager").then(module => ({ default: module.ProductosManager })));
const ProgresoView = lazy(() => import("./Progreso/ProgresoView").then(module => ({ default: module.ProgresoView })));
const StudentHome = lazy(() => import("./StudentsHome/StudentHome").then(module => ({ default: module.StudentHome })));
const AsistenciaManual = lazy(() => import("../Pages/Asistencias/AsistenciaManual").then(module => ({ default: module.AsistenciaManual })));
const FrasesManager = lazy(() => import("../Pages/Config/FrasesManager").then(module => ({ default: module.FrasesManager })));
const EmpleadosManager = lazy(() => import("../Pages/Empleados/EmpleadosManager").then(module => ({ default: module.EmpleadosManager })));
const GastosManager = lazy(() => import("../Pages/Pagos/GastosManager").then(module => ({ default: module.GastosManager })));
const NotasManager = lazy(() => import("../Pages/Notas/NotasManager").then(module => ({ default: module.NotasManager })));
const DietasManager = lazy(() => import("../Pages/Dietas/DietasManager").then(module => ({ default: module.DietasManager })));

import {
  Home as HomeIcon, Dumbbell, Gem, TrendingUp, Users, RefreshCw, Send,
  LogOut, User, Settings, Building2, Receipt, BookOpen, ShoppingBag,
  FileText, CheckSquare, Bell, UserPlus, MessageSquare, Wallet, ClipboardList, Salad
} from "lucide-react";

const Icons = {
  dashboard: <HomeIcon size={20} />, rutinas: <Dumbbell size={20} />, planes: <Gem size={20} />, finanzas: <TrendingUp size={20} />,
  ejercicios: <Dumbbell size={20} />, notificaciones: <Bell size={20} />, usuarios: <Users size={20} />, nuevoUsuario: <UserPlus size={20} />,
  enviarPDF: <Send size={20} />, renovar: <RefreshCw size={20} />, salir: <LogOut size={20} />, perfil: <User size={20} />, preferencias: <Settings size={20} />, 
  nuevoGym: <Building2 size={20} />, gestionGyms: <Settings size={20} />, reciboManual: <Receipt size={20} />, crearRutinaGeneral: <BookOpen size={20} />,
  tienda: <ShoppingBag size={20} />, rutinasUsuarios: <FileText size={20} />, asistencia: <CheckSquare size={20} />, frases: <MessageSquare size={20} />, gastos: <Wallet size={20} />, notas: <ClipboardList size={20} />,
  dietas: <Salad size={20} />
};

const TabLoading = () => (
    <div className="flex flex-col items-center justify-center h-64 text-white/50 animate-pulse gap-4">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
);

const LazySlideContent = ({ children, index, activeIndex, visited }: { children: any, index: number, activeIndex: number, visited: boolean }) => {
    if (visited || index === activeIndex) {
        return <Suspense fallback={<TabLoading />}>{children}</Suspense>;
    }
    return <div className="h-full w-full" />;
};

export const Home = () => {
  const { currentUser, isEntrenador, isAdmin, isLoading, metrics, logout } = useOptimizedHome();  

  // Registrar Push Notifications (si estamos en celular y hay usuario)
  usePushNotifications(currentUser);

  // ESTADOS ADMIN
  const [activeTab, setActiveTab] = useState("Inicio");
  const [routineIdToEdit, setRoutineIdToEdit] = useState<number | null>(null);
  const [groupIdToEdit, setGroupIdToEdit] = useState<string | null>(null);

  // Estado principal
  const [activeSlide, setActiveSlide] = useState(0);
  const swiperRef = useRef<any>(null);

  // Verificamos si está vencido para ocultar navegación
  const { activePlans, isUserExpired, loading: loadingPlans } = useUserPlan();
  
  const [visitedSlides, setVisitedSlides] = useState<Set<number>>(new Set([0]));

  // VALIDACIÓN: ¿El módulo de asistencia está habilitado para este gym?
  const isAsistenciaHabilitada = currentUser?.gym?.moduloAsistencia !== false;

  // NUEVO: Hook para controlar la lucecita de alertas
  const { hasAlert, clearAlert } = useAlertasRecepcion(
      isEntrenador || isAdmin, 
      currentUser?.gym?.id,
      isAsistenciaHabilitada
  );

  const handleEditRoutine = (id: number) => {
      setRoutineIdToEdit(id);
      setGroupIdToEdit(null);
      setActiveTab("Crear Rutina General");
  };

  const handleEditGroup = (grupoId: string) => {
      setGroupIdToEdit(grupoId);
      setRoutineIdToEdit(null);
      setActiveTab("Crear Rutina General");
  };

  const handleSidebarClick = (tabName: string) => {
      setRoutineIdToEdit(null);
      setGroupIdToEdit(null);
      setActiveTab(tabName);
      
      // Si entra a ver las asistencias, apagamos la luz roja
      if (tabName === "Asistencia Manual") {
          clearAlert();
      }
  };

  const handleSlideChange = (swiper: any) => {
    const newIndex = swiper.activeIndex;
    setActiveSlide(newIndex);
    setVisitedSlides(prev => {
        const newSet = new Set(prev);
        newSet.add(newIndex);
        return newSet;
    });
  };

  const handleMenuClick = (index: number) => {
    setActiveSlide(index);
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }
  };

  if (isLoading || loadingPlans) return <div className="min-h-screen flex items-center justify-center bg-gray-900"><p className="text-white animate-pulse">Cargando...</p></div>;
  if (!currentUser) return null; 

  if (isUserExpired && currentUser?.rol === 'Alumno') {
      const planToRenew = activePlans.length > 0 ? activePlans[0] : null;
      return <ExpiredPlanPage currentUser={currentUser} expiredPlan={planToRenew} />;
  }

  if (isEntrenador || isAdmin) {
    const AdminDashboardWelcome = () => (
        <div className="animate-fade-in-up space-y-6 mt-20">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <h2 className="text-3xl font-bold text-white relative z-10">
              Hola, <span className="text-green-400">{currentUser?.nombre}</span> 👋
            </h2>
            <p className="text-gray-400 mt-2 relative z-10 max-w-lg">
              Aquí tienes un resumen de la actividad del gimnasio.
            </p>
            <p className="text-gray-400 mt-2 relative z-10 max-w-lg">
              Todo parece estar en orden 😎
            </p>
          </div>
          {metrics && <StatsGrid metrics={metrics} userRole={currentUser?.rol || ''} />}
        </div>
    );

    const renderAdminContent = () => {
        return (
            <Suspense fallback={<TabLoading />}>
                {(() => {
                    switch (activeTab) {
                        case "Inicio": return <AdminDashboardWelcome/>;
                        case "Planes": return <PlansManager />;
                        case "Empleados": return <EmpleadosManager />;
                        case "Finanzas": return <MetricasFinancieras />;
                        case "Control de Gastos": return <GastosManager />;
                        case "Notas y Recordatorios": return <NotasManager onNavigate={handleSidebarClick} />;
                        case "Crear Rutina": return <CreateRoutine isGeneral={false} />;
                        case "Rutinas Generales": return <GeneralRoutinesManager onNavigate={handleSidebarClick} onEdit={handleEditRoutine} onEditGroup={handleEditGroup}/>;
                        case "Rutinas Usuarios": return <UserRoutinesManager onNavigate={handleSidebarClick} onEdit={handleEditRoutine} onEditGroup={handleEditGroup}/>;
                        case "Crear Rutina General": return <CreateRoutine isGeneral={true} routineIdToEdit={routineIdToEdit} groupIdToEdit={groupIdToEdit} />;
                        case "Gestión de Dietas": return <DietasManager />;
                        case "Ejercicios": return <EjerciciosGestion onNavigate={setActiveTab} />;
                        case "Crear Ejercicio": return <EjerciciosCrear onNavigate={setActiveTab} />;
                        case "Notificaciones": return <CreateNotification />;
                        case "Nuevo Usuario": return <CreateUser />;
                        case "Gestionar Usuarios": return <UsersManager />;
                        case "Enviar PDF": return <SendRoutinePDF />; 
                        case "Renovar": return <RenewPlan />;
                        case "Perfil": return <Profile />;
                        case "Preferencias": return <Preferences />; 
                        case "Nuevo Gimnasio": return <CreateGym />;
                        case "Gestión Gimnasios": return <GymManagement />; 
                        case "Enviar Recibo Manualmente": return <ManualReceipt />;
                        case "Productos": return <ProductosManager />;
                        case "Asistencia Manual": return <AsistenciaManual />;
                        case "Frases": return <FrasesManager />;
                        default: return <AdminDashboardWelcome />;
                    }
                })()}
            </Suspense>
        );
    };

    return (
      <BackgroundLayout>
        <div className="flex h-screen overflow-hidden font-sans">
          <WhatsAppModal />
          <aside className="w-64 bg-[#24192f99] border-r border-white/5 flex flex-col justify-between md:flex shrink-0 transition-all duration-300">
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="h-20 flex items-center px-6 border-b border-white/5 cursor-pointer shrink-0 group" onClick={() => handleSidebarClick("Inicio")}>
                <span className="text-2xl font-bold">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00AEEF] to-[#0071BC]">Gym</span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF8C00] to-[#d3932b]">Mate</span>
                </span>
                {(currentUser?.gym as any)?.logoUrl && (
                  <div className="flex items-center ml-3 pl-3 border-l border-white/20 h-10 animate-fade-in">
                    <img 
                      src={CloudinaryApi.getUrl((currentUser?.gym as any)?.logoUrl) || undefined} 
                      alt="Logo Gym"
                      className="h-14 w-auto object-contain transition-transform group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              <nav className={`p-4 space-y-2 mt-4 ${AppStyles.customScrollbar}`}>
                
                <SidebarItem icon={Icons.dashboard} label="Inicio" active={activeTab === "Inicio"} onClick={() => handleSidebarClick("Inicio")} />
                <SidebarItem icon={Icons.notas} label="Notas y Recordatorios" active={activeTab === "Notas y Recordatorios"} onClick={() => handleSidebarClick("Notas y Recordatorios")} />

                
                {isAsistenciaHabilitada && (
                    <>
                        <p className="px-4 text-xs font-bold text-purple-500 uppercase tracking-wider mb-2 mt-4">Recepción</p>
                        <SidebarItem 
                            icon={Icons.asistencia} 
                            label="Asistencia Manual" 
                            active={activeTab === "Asistencia Manual"} 
                            onClick={() => handleSidebarClick("Asistencia Manual")} 
                            hasAlert={hasAlert}
                        />
                    </>
                )}

                <p className="px-4 text-xs font-bold text-purple-500 uppercase tracking-wider mb-2 mt-4">Gestión de Usuarios</p>
                <SidebarItem icon={Icons.dietas} label="Dietas" active={activeTab === "Gestión de Dietas"} onClick={() => handleSidebarClick("Gestión de Dietas")} />
                <SidebarItem icon={Icons.planes} label="Planes Mensuales" active={activeTab === "Planes"} onClick={() => handleSidebarClick("Planes")} />
                <SidebarItem icon={Icons.renovar} label="Renovar Mensualidad" active={activeTab === "Renovar"} onClick={() => handleSidebarClick("Renovar")} />
                <SidebarItem icon={Icons.usuarios} label="Gestionar Usuarios" active={activeTab === "Gestionar Usuarios"} onClick={() => handleSidebarClick("Gestionar Usuarios")} />
                
                <p className="px-4 text-xs font-bold text-purple-500 uppercase tracking-wider mb-2 mt-4">Rutinas</p>
                <SidebarItem icon={Icons.crearRutinaGeneral} label="Rutinas Generales" active={activeTab === "Rutinas Generales"} onClick={() => handleSidebarClick("Rutinas Generales")} />
                <SidebarItem icon={Icons.rutinasUsuarios} label="Rutinas Usuarios" active={activeTab === "Rutinas Usuarios"} onClick={() => handleSidebarClick("Rutinas Usuarios")} />
                <SidebarItem icon={Icons.ejercicios} label="Ejercicios" active={activeTab === "Ejercicios" || activeTab === "Crear Ejercicio"} onClick={() => handleSidebarClick("Ejercicios")} />
                
                <p className="px-4 text-xs font-bold text-purple-500 uppercase tracking-wider mb-2 mt-4">Finanzas</p>
                <SidebarItem icon={Icons.finanzas} label="Finanzas" active={activeTab === "Finanzas"} onClick={() => handleSidebarClick("Finanzas")} />
                <SidebarItem icon={Icons.gastos} label="Control de Gastos" active={activeTab === "Control de Gastos"} onClick={() => handleSidebarClick("Control de Gastos")} />
                <SidebarItem icon={Icons.usuarios} label="Empleados" active={activeTab === "Empleados"} onClick={() => handleSidebarClick("Empleados")} />

                <p className="px-4 text-xs font-bold text-purple-500 uppercase tracking-wider mb-2 mt-4">Tienda</p>
                <SidebarItem icon={Icons.tienda} label="Productos" active={activeTab === "Productos"} onClick={() => handleSidebarClick("Productos")} />
                
                <p className="px-4 text-xs font-bold text-purple-500 uppercase tracking-wider mb-2 mt-6">Social</p>
                <SidebarItem icon={Icons.notificaciones} label="Notificaciones" active={activeTab === "Notificaciones"} onClick={() => handleSidebarClick("Notificaciones")} />
                <SidebarItem icon={Icons.enviarPDF} label="Enviar Rutina PDF" active={activeTab === "Enviar PDF"} onClick={() => handleSidebarClick("Enviar PDF")} />
                <SidebarItem icon={Icons.reciboManual} label="Enviar Recibo Manualmente" active={activeTab === "Enviar Recibo Manualmente"} onClick={() => handleSidebarClick("Enviar Recibo Manualmente")} />
                <SidebarItem icon={Icons.nuevoUsuario} label="Nuevo Usuario" active={activeTab === "Nuevo Usuario"} onClick={() => handleSidebarClick("Nuevo Usuario")} />
                
                <p className="px-4 text-xs font-bold text-purple-500 uppercase tracking-wider mb-2 mt-6">Sistema</p>
                <SidebarItem icon={Icons.preferencias} label="Preferencias" active={activeTab === "Preferencias"} onClick={() => handleSidebarClick("Preferencias")} />
                <SidebarItem icon={Icons.perfil} label="Mi Perfil" active={activeTab === "Perfil"} onClick={() => handleSidebarClick("Perfil")} />
                
                {isAdmin && (
                  <>
                    <p className="px-4 text-xs font-bold text-purple-500 uppercase tracking-wider mb-2 mt-6">Administración</p>
                    <SidebarItem icon={Icons.frases} label="Frases" active={activeTab === "Frases"} onClick={() => handleSidebarClick("Frases")} />
                    <SidebarItem icon={Icons.nuevoGym} label="Nuevo Gimnasio" active={activeTab === "Nuevo Gimnasio"} onClick={() => handleSidebarClick("Nuevo Gimnasio")} />
                    <SidebarItem icon={Icons.gestionGyms} label="Gestión Gimnasios" active={activeTab === "Gestión Gimnasios"} onClick={() => handleSidebarClick("Gestión Gimnasios")} />
                  </>
                )}
              </nav>
            </div>
            <div className="shrink-0 bg-[#1a1225]">
              <WhatsAppStatus />
              <div className="p-4">
                <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-medium text-sm">
                  <span>{Icons.salir}</span> Cerrar Sesión
                </button>
              </div>
            </div>
          </aside>
          <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
            <div className={`flex-1 p-8 relative z-10 ${AppStyles.customScrollbar}`}>
              {renderAdminContent()}
            </div>
          </main>
        </div>
      </BackgroundLayout>
    );
  }

  return (
    <BackgroundLayout>
      
        <NavbarSuperior />
      
      <div className="h-screen w-screen overflow-hidden relative">
        <Swiper
            ref={swiperRef}
            modules={[Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            onSlideChange={handleSlideChange}
            className="h-full w-full pb-32"
            style={{ touchAction: 'pan-y' }} 
            speed={300} 
        >
            <SwiperSlide className="overflow-y-auto h-full">
                <div className="h-full overflow-y-auto custom-scrollbar pb-32">
                    <LazySlideContent index={0} activeIndex={activeSlide} visited={visitedSlides.has(0)}>
                        <StudentHome currentUser={currentUser} />
                    </LazySlideContent>
                </div>
            </SwiperSlide>

            <SwiperSlide className="overflow-y-auto h-full">
                <div className="h-full overflow-y-auto custom-scrollbar pb-32">
                    <LazySlideContent index={1} activeIndex={activeSlide} visited={visitedSlides.has(1)}>
                        <MyRoutines /> 
                    </LazySlideContent>
                </div>
            </SwiperSlide>

            <SwiperSlide className="h-full">
                <div className="h-full">
                    <LazySlideContent index={2} activeIndex={activeSlide} visited={visitedSlides.has(2)}>
                        {/* Le pasamos currentUser para poder guardar en el gym correcto */}
                        <ProgresoView currentUser={currentUser} /> 
                    </LazySlideContent>
                </div>
            </SwiperSlide>

            <SwiperSlide className="overflow-y-auto h-full">
                <div className="h-full overflow-y-auto custom-scrollbar pb-32">
                    <LazySlideContent index={3} activeIndex={activeSlide} visited={visitedSlides.has(3)}>
                        <Profile isMobile={true} />
                    </LazySlideContent>
                </div>
            </SwiperSlide>
        </Swiper>

        {!isUserExpired && (
            <NavbarInferior activeTab={activeSlide} setActiveTab={handleMenuClick} />
        )}
      </div>
    </BackgroundLayout>
  );
};

// SidebarItem ahora recibe hasAlert para mostrar la luz roja
const SidebarItem = ({ icon, label, active, onClick, hasAlert }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, hasAlert?: boolean }) => {
  return (
    <div onClick={onClick} className={`relative flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${active ? 'bg-green-500/10 text-green-400 border-r-2 border-green-500' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
      <span className={`text-xl group-hover:scale-110 transition-transform ${active ? 'scale-110' : ''}`}>{icon}</span>
      <span className="font-medium text-sm">{label}</span>
      
      {/* LA LUCECITA ROJA PARPADEANTE */}
      {hasAlert && (
        <span className="absolute right-4 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}
    </div>
  )
}