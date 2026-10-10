use glam::Mat4;
use windows::{
    core::{Interface, PCWSTR},
    Win32::{
        Foundation::{HWND, LPARAM, LRESULT, RECT, WPARAM},
        Graphics::{
       
    Direct3D::{
        D3D_FEATURE_LEVEL_11_0,
        D3D_PRIMITIVE_TOPOLOGY_TRIANGLELIST,
    },
            Direct3D12::{
                D3D12_CLEAR_FLAG_DEPTH,
                D3D12_DESCRIPTOR_HEAP_TYPE_CBV_SRV_UAV,
D3D12_DESCRIPTOR_HEAP_FLAG_SHADER_VISIBLE,
D3D12_SHADER_RESOURCE_VIEW_DESC,
D3D12_SHADER_RESOURCE_VIEW_DESC_0,
D3D12_TEX2D_SRV,
D3D12_SRV_DIMENSION_TEXTURE2D,
D3D12_DEFAULT_SHADER_4_COMPONENT_MAPPING,
D3D12_RESOURCE_BARRIER_TYPE_TRANSITION,
D3D12_RESOURCE_BARRIER_ALL_SUBRESOURCES,
D3D12_RESOURCE_STATE_PIXEL_SHADER_RESOURCE,
                D3D12_BLEND_DESC,
                D3D12_BLEND_OP_ADD,
                D3D12_BLEND_ONE,
                D3D12_BLEND_ZERO,
                D3D12_CULL_MODE_BACK,
                D3D12_CONSERVATIVE_RASTERIZATION_MODE_OFF,
                D3D12_DEPTH_WRITE_MASK_ALL,
                D3D12_COMPARISON_FUNC_LESS,
                D3D12_GRAPHICS_PIPELINE_STATE_DESC,
                D3D12_INDEX_BUFFER_STRIP_CUT_VALUE_DISABLED,
                D3D12_PIPELINE_STATE_FLAG_NONE,
                D3D12_COLOR_WRITE_ENABLE_ALL,
                D3D12_COMMAND_LIST_TYPE_DIRECT,
                D3D12_COMMAND_QUEUE_DESC,
                D3D12_COMPARISON_FUNC_ALWAYS,
                D3D12_HEAP_FLAG_NONE,
                D3D12_CULL_MODE_NONE,
                D3D12_DEPTH_STENCIL_DESC,
                D3D12_DEPTH_STENCIL_VIEW_DESC,
                D3D12_DEPTH_WRITE_MASK_ZERO,
                D3D12_FILL_MODE_SOLID,
                D3D12_HEAP_PROPERTIES,
                D3D12_HEAP_TYPE_UPLOAD,
                D3D12_INPUT_CLASSIFICATION_PER_VERTEX_DATA,
                D3D12_INPUT_ELEMENT_DESC,
                D3D12_INPUT_LAYOUT_DESC,
                D3D12_LOGIC_OP_NOOP,
                D3D12_RESOURCE_STATE_DEPTH_WRITE,
                
                D3D12_PRIMITIVE_TOPOLOGY_TYPE_TRIANGLE,
                D3D12_RASTERIZER_DESC,
                D3D12_RENDER_TARGET_BLEND_DESC,
                D3D12_RESOURCE_BARRIER,
                D3D12_RESOURCE_BARRIER_0,
                D3D12_RESOURCE_DIMENSION_BUFFER,
                D3D12_RESOURCE_STATE_COPY_DEST,
                D3D12_RESOURCE_STATE_GENERIC_READ,
                D3D12_RESOURCE_STATE_PRESENT,
                D3D12_RESOURCE_STATE_RENDER_TARGET,
                D3D12_RESOURCE_TRANSITION_BARRIER,
                D3D12_RESOURCE_DESC,
                D3D12_RESOURCE_FLAG_NONE,
                D3D12_RESOURCE_STATES,
                D3D12_ROOT_SIGNATURE_FLAG_ALLOW_INPUT_ASSEMBLER_INPUT_LAYOUT,
                
                D3D12_DSV_DIMENSION_TEXTURE2D,
              
                D3D12_SHADER_BYTECODE,
                D3D12_TEXTURE_LAYOUT_ROW_MAJOR,
                D3D12_VIEWPORT,
                D3D12_VERTEX_BUFFER_VIEW,
                D3D12CreateDevice,
                D3D12GetDebugInterface,
                D3D12SerializeRootSignature,
                D3D12_ROOT_SIGNATURE_DESC,
                D3D12_ROOT_PARAMETER,
                D3D12_ROOT_PARAMETER_TYPE_CBV,
                D3D12_ROOT_DESCRIPTOR,
                
                
                D3D12_DESCRIPTOR_RANGE_TYPE_SRV,
                D3D12_SHADER_VISIBILITY_ALL,
                
                D3D12_DESCRIPTOR_HEAP_DESC,
                D3D12_DESCRIPTOR_HEAP_TYPE_RTV,
                D3D12_DESCRIPTOR_HEAP_FLAG_NONE,
                D3D12_CPU_DESCRIPTOR_HANDLE,
                
                D3D12_FENCE_FLAG_NONE,
                D3D_ROOT_SIGNATURE_VERSION_1,
                
              
                ID3D12CommandAllocator,
                ID3D12CommandQueue,
                ID3D12Fence,
                ID3D12GraphicsCommandList,
                ID3D12PipelineState,
                ID3D12Resource,
                ID3D12RootSignature,
                ID3D12Device,
                ID3D12DescriptorHeap,
                
            },
            Dxgi::{
                Common::{
                    DXGI_FORMAT_R32_FLOAT,
                    DXGI_FORMAT_R8G8B8A8_UNORM,
                    DXGI_FORMAT_UNKNOWN,
                    DXGI_FORMAT_R32G32B32_FLOAT,
                    DXGI_SAMPLE_DESC,
                    DXGI_FORMAT_D32_FLOAT,
                    DXGI_FORMAT_R32_TYPELESS,
                },
                CreateDXGIFactory2,
                IDXGIFactory4,
                IDXGISwapChain3,
                DXGI_SWAP_CHAIN_DESC1,
                DXGI_SWAP_EFFECT_FLIP_DISCARD,
                DXGI_USAGE_RENDER_TARGET_OUTPUT,
                DXGI_CREATE_FACTORY_FLAGS,
                DXGI_PRESENT,
                
            },
        },
        System::{
            LibraryLoader::GetModuleHandleW,
            Threading::{CreateEventW, WaitForSingleObject, INFINITE},
        },
        UI::WindowsAndMessaging::{
            CreateWindowExW,
            CS_HREDRAW,
            CS_VREDRAW,
            CW_USEDEFAULT,
            DefWindowProcW,
            DispatchMessageW,
            GetMessageW,
            IDC_ARROW,
            LoadCursorW,
            MSG,
            PostQuitMessage,
            RegisterClassW,
            ShowWindow,
            SW_SHOW,
            TranslateMessage,
            WINDOW_EX_STYLE,
            WM_DESTROY,
            WNDCLASSW,
            WS_OVERLAPPEDWINDOW,
        },
    },
};

#[repr(C)]
#[derive(Clone, Copy)]
struct Vertex {
    position: [f32; 3],
    normal: [f32; 3],
}
#[repr(C)]
#[derive(Clone, Copy)]
struct CameraBuffer {
    transform: [[f32; 4]; 4],
}

fn main() {
    unsafe {
        // ==========================================
        // CREATE WINDOWS WINDOW
        // ==========================================

        let module = GetModuleHandleW(None).unwrap();

        let instance =
            windows::Win32::Foundation::HINSTANCE(module.0);

        let class_name: Vec<u16> =
            "JungleGameNativeWindow\0"
                .encode_utf16()
                .collect();

        let window_class = WNDCLASSW {
            style: CS_HREDRAW | CS_VREDRAW,
            lpfnWndProc: Some(window_proc),
            hInstance: instance,
            hCursor: LoadCursorW(None, IDC_ARROW).unwrap(),
            lpszClassName: PCWSTR(class_name.as_ptr()),
            ..Default::default()
        };

        RegisterClassW(&window_class);

        let title: Vec<u16> =
            "JungleGame - DirectX 12 Native Test\0"
                .encode_utf16()
                .collect();

        let hwnd: HWND = CreateWindowExW(
            WINDOW_EX_STYLE::default(),
            PCWSTR(class_name.as_ptr()),
            PCWSTR(title.as_ptr()),
            WS_OVERLAPPEDWINDOW,
            CW_USEDEFAULT,
            CW_USEDEFAULT,
            1280,
            720,
            None,
            None,
            Some(instance),
            None,
        )
        .unwrap();

        let _ = ShowWindow(hwnd, SW_SHOW);

        println!("==========================================");
        println!("🌴 JungleGame Native Renderer");
        println!("==========================================");
        println!("✅ Windows window created");

        // ==========================================
// CUBE VERTICES
// ==========================================

let cube_vertices = [
    // Front
    Vertex { position: [-0.5, -0.5, -0.5], normal: [ 0.0,  0.0, -1.0] },
    Vertex { position: [-0.5,  0.5, -0.5], normal: [ 0.0,  0.0, -1.0] },
    Vertex { position: [ 0.5,  0.5, -0.5], normal: [ 0.0,  0.0, -1.0] },

    Vertex { position: [-0.5, -0.5, -0.5], normal: [ 0.0,  0.0, -1.0] },
    Vertex { position: [ 0.5,  0.5, -0.5], normal: [ 0.0,  0.0, -1.0] },
    Vertex { position: [ 0.5, -0.5, -0.5], normal: [ 0.0,  0.0, -1.0] },

    // Back
    Vertex { position: [-0.5, -0.5,  0.5], normal: [ 0.0,  0.0,  1.0] },
    Vertex { position: [ 0.5,  0.5,  0.5], normal: [ 0.0,  0.0,  1.0] },
    Vertex { position: [-0.5,  0.5,  0.5], normal: [ 0.0,  0.0,  1.0] },

    Vertex { position: [-0.5, -0.5,  0.5], normal: [ 0.0,  0.0,  1.0] },
    Vertex { position: [ 0.5, -0.5,  0.5], normal: [ 0.0,  0.0,  1.0] },
    Vertex { position: [ 0.5,  0.5,  0.5], normal: [ 0.0,  0.0,  1.0] },

    // Left
    Vertex { position: [-0.5, -0.5,  0.5], normal: [-1.0, 0.0, 0.0] },
    Vertex { position: [-0.5,  0.5,  0.5], normal: [-1.0, 0.0, 0.0] },
    Vertex { position: [-0.5,  0.5, -0.5], normal: [-1.0, 0.0, 0.0] },

    Vertex { position: [-0.5, -0.5,  0.5], normal: [-1.0, 0.0, 0.0] },
    Vertex { position: [-0.5,  0.5, -0.5], normal: [-1.0, 0.0, 0.0] },
    Vertex { position: [-0.5, -0.5, -0.5], normal: [-1.0, 0.0, 0.0] },

    // Right
    Vertex { position: [0.5, -0.5, -0.5], normal: [1.0, 0.0, 0.0] },
    Vertex { position: [0.5,  0.5, -0.5], normal: [1.0, 0.0, 0.0] },
    Vertex { position: [0.5,  0.5,  0.5], normal: [1.0, 0.0, 0.0] },

    Vertex { position: [0.5, -0.5, -0.5], normal: [1.0, 0.0, 0.0] },
    Vertex { position: [0.5,  0.5,  0.5], normal: [1.0, 0.0, 0.0] },
    Vertex { position: [0.5, -0.5,  0.5], normal: [1.0, 0.0, 0.0] },

    // Top
    Vertex { position: [-0.5, 0.5, -0.5], normal: [0.0, 1.0, 0.0] },
    Vertex { position: [-0.5, 0.5,  0.5], normal: [0.0, 1.0, 0.0] },
    Vertex { position: [ 0.5, 0.5,  0.5], normal: [0.0, 1.0, 0.0] },

    Vertex { position: [-0.5, 0.5, -0.5], normal: [0.0, 1.0, 0.0] },
    Vertex { position: [ 0.5, 0.5,  0.5], normal: [0.0, 1.0, 0.0] },
    Vertex { position: [ 0.5, 0.5, -0.5], normal: [0.0, 1.0, 0.0] },

    // Bottom
    Vertex { position: [-0.5, -0.5,  0.5], normal: [0.0, -1.0, 0.0] },
    Vertex { position: [-0.5, -0.5, -0.5], normal: [0.0, -1.0, 0.0] },
    Vertex { position: [ 0.5, -0.5, -0.5], normal: [0.0, -1.0, 0.0] },

    Vertex { position: [-0.5, -0.5,  0.5], normal: [0.0, -1.0, 0.0] },
    Vertex { position: [ 0.5, -0.5, -0.5], normal: [0.0, -1.0, 0.0] },
    Vertex { position: [ 0.5, -0.5,  0.5], normal: [0.0, -1.0, 0.0] },
];

println!("âœ… Cube vertices created");
let model = Mat4::IDENTITY;
let model =
    Mat4::from_rotation_y(0.6) *
    Mat4::from_rotation_x(0.4);

let view = Mat4::look_at_rh(
    glam::Vec3::new(0.0, 0.0, 3.0),
    glam::Vec3::ZERO,
    glam::Vec3::Y,
);

let projection = Mat4::perspective_rh(
    45.0_f32.to_radians(),
    1280.0 / 720.0,
    0.1,
    100.0,
);
// ==========================================
// SHADOW LIGHT CAMERA
// ==========================================

let light_position =
    glam::Vec3::new(-4.0, 6.0, -4.0);

let light_target =
    glam::Vec3::ZERO;

let light_view =
    Mat4::look_at_rh(
        light_position,
        light_target,
        glam::Vec3::Y,
    );

let light_projection =
    Mat4::orthographic_rh(
        -5.0,
        5.0,
        -5.0,
        5.0,
        0.1,
        20.0,
    );

let light_transform =
    light_projection * light_view;
    let light_data = CameraBuffer {
    transform: light_transform.to_cols_array_2d(),
};

println!("✅ Shadow light matrix created");

println!("✅ Shadow light camera created");

let transform = projection * view * model;
let camera_data = CameraBuffer {
    transform: transform.to_cols_array_2d(),
};

println!("✅ Camera buffer data created");
println!("✅ Camera transformation matrix created");
        // ==========================================
        // CREATE DIRECTX 12 DEVICE
        // ==========================================

        let mut device: Option<ID3D12Device> = None;

        D3D12CreateDevice(
            None,
            D3D_FEATURE_LEVEL_11_0,
            &mut device,
        )
        .expect("Failed to create DirectX 12 device");

        let device =
            device.expect("DirectX 12 returned no device");

        println!("✅ DirectX 12 device created");
        println!("🎮 GPU is accessible through D3D12");
        // ==========================================
// CREATE CAMERA CONSTANT BUFFER
// ==========================================

let camera_buffer_size: u64 = 256;

let camera_buffer_description = D3D12_RESOURCE_DESC {
    Dimension: D3D12_RESOURCE_DIMENSION_BUFFER,
    Alignment: 0,
    Width: camera_buffer_size,
    Height: 1,
    DepthOrArraySize: 1,
    MipLevels: 1,
    Format: DXGI_FORMAT_UNKNOWN,
    SampleDesc: DXGI_SAMPLE_DESC {
        Count: 1,
        Quality: 0,
    },
    Layout: D3D12_TEXTURE_LAYOUT_ROW_MAJOR,
    Flags: D3D12_RESOURCE_FLAG_NONE,
};

let camera_heap_properties = D3D12_HEAP_PROPERTIES {
    Type: D3D12_HEAP_TYPE_UPLOAD,
    CPUPageProperty: Default::default(),
    MemoryPoolPreference: Default::default(),
    CreationNodeMask: 1,
    VisibleNodeMask: 1,
};

let mut camera_buffer: Option<ID3D12Resource> = None;

device
    .CreateCommittedResource(
        &camera_heap_properties,
        windows::Win32::Graphics::Direct3D12::D3D12_HEAP_FLAG_NONE,
        &camera_buffer_description,
        D3D12_RESOURCE_STATE_GENERIC_READ,
        None,
        &mut camera_buffer,
    )
    .expect("Failed to create camera constant buffer");

let camera_buffer =
    camera_buffer.expect("Camera buffer was not created");

println!("✅ Camera constant buffer created");
// ==========================================
// 💡 LIGHT CONSTANT BUFFER
// ==========================================

let light_buffer_size: u64 = 256;

let light_buffer_description = D3D12_RESOURCE_DESC {
    Dimension: D3D12_RESOURCE_DIMENSION_BUFFER,
    Alignment: 0,
    Width: light_buffer_size,
    Height: 1,
    DepthOrArraySize: 1,
    MipLevels: 1,
    Format: DXGI_FORMAT_UNKNOWN,
    SampleDesc: DXGI_SAMPLE_DESC {
        Count: 1,
        Quality: 0,
    },
    Layout: D3D12_TEXTURE_LAYOUT_ROW_MAJOR,
    Flags: D3D12_RESOURCE_FLAG_NONE,
};

let mut light_buffer: Option<ID3D12Resource> = None;

device
    .CreateCommittedResource(
        &camera_heap_properties,
        D3D12_HEAP_FLAG_NONE,
        &light_buffer_description,
        D3D12_RESOURCE_STATE_GENERIC_READ,
        None,
        &mut light_buffer,
    )
    .expect("Failed to create light constant buffer");

let light_buffer =
    light_buffer.expect("Light buffer was not created");

println!("✅ Light constant buffer created");

// ==========================================
// COPY CAMERA DATA INTO GPU BUFFER
// ==========================================

let mut camera_mapped_data: *mut std::ffi::c_void =
    std::ptr::null_mut();

camera_buffer
    .Map(0, None, Some(&mut camera_mapped_data))
    .expect("Failed to map camera buffer");

std::ptr::copy_nonoverlapping(
    &camera_data as *const CameraBuffer as *const u8,
    camera_mapped_data as *mut u8,
    std::mem::size_of::<CameraBuffer>(),
);

camera_buffer.Unmap(0, None);

println!("✅ Camera matrix copied into GPU buffer");
// Copy light matrix into GPU buffer
let mut light_mapped_ptr: *mut std::ffi::c_void = std::ptr::null_mut();

light_buffer
    .Map(0, None, Some(&mut light_mapped_ptr))
    .expect("Failed to map light buffer");

let light_data_ptr =
    light_mapped_ptr as *mut CameraBuffer;

*light_data_ptr = light_data;

light_buffer.Unmap(0, None);

println!("✅ Light matrix copied into GPU buffer");

        // ==========================================
        // CREATE GPU VERTEX BUFFER
        // ==========================================

        let vertex_buffer_size =
    std::mem::size_of_val(&cube_vertices) as u64;

        let heap_properties = D3D12_HEAP_PROPERTIES {
            Type: D3D12_HEAP_TYPE_UPLOAD,
            CPUPageProperty: Default::default(),
            MemoryPoolPreference: Default::default(),
            CreationNodeMask: 1,
            VisibleNodeMask: 1,
        };

        let buffer_description = D3D12_RESOURCE_DESC {
            Dimension: D3D12_RESOURCE_DIMENSION_BUFFER,
            Alignment: 0,
            Width: vertex_buffer_size,
            Height: 1,
            DepthOrArraySize: 1,
            MipLevels: 1,
            Format: DXGI_FORMAT_UNKNOWN,
            SampleDesc: DXGI_SAMPLE_DESC {
                Count: 1,
                Quality: 0,
            },
            Layout: D3D12_TEXTURE_LAYOUT_ROW_MAJOR,
            Flags: D3D12_RESOURCE_FLAG_NONE,
        };

        let mut vertex_buffer: Option<ID3D12Resource> = None;

        device
            .CreateCommittedResource(
                &heap_properties,
                windows::Win32::Graphics::Direct3D12::D3D12_HEAP_FLAG_NONE,
                &buffer_description,
                D3D12_RESOURCE_STATE_GENERIC_READ,
                None,
                &mut vertex_buffer,
            )
            .expect("Failed to create GPU vertex buffer");

        let vertex_buffer =
            vertex_buffer.expect("Vertex buffer was not created");

        println!("✅ GPU vertex buffer created");

        // ==========================================
        // COPY VERTICES INTO GPU BUFFER
        // ==========================================

        let mut mapped_data: *mut std::ffi::c_void =
            std::ptr::null_mut();

        vertex_buffer
            .Map(0, None, Some(&mut mapped_data))
            .expect("Failed to map vertex buffer");

        std::ptr::copy_nonoverlapping(
            cube_vertices.as_ptr() as *const u8,
            mapped_data as *mut u8,
            vertex_buffer_size as usize,
        );

        vertex_buffer.Unmap(0, None);

        println!("✅ Cube vertices copied into GPU buffer");

        // ==========================================
        // VERTEX BUFFER VIEW
        // ==========================================

        let vertex_buffer_view = D3D12_VERTEX_BUFFER_VIEW {
            BufferLocation: vertex_buffer.GetGPUVirtualAddress(),
            SizeInBytes: vertex_buffer_size as u32,
            StrideInBytes: std::mem::size_of::<Vertex>() as u32,
        };

        println!("✅ Vertex buffer view created");

        // ==========================================
        // INPUT LAYOUT
        // ==========================================
                let position_semantic = b"POSITION\0";
        let normal_semantic = b"NORMAL\0";

        let input_elements = [
            D3D12_INPUT_ELEMENT_DESC {
                SemanticName: windows::core::PCSTR(position_semantic.as_ptr()),
                SemanticIndex: 0,
                Format: DXGI_FORMAT_R32G32B32_FLOAT,
                InputSlot: 0,
                AlignedByteOffset: 0,
                InputSlotClass: D3D12_INPUT_CLASSIFICATION_PER_VERTEX_DATA,
                InstanceDataStepRate: 0,
            },

            D3D12_INPUT_ELEMENT_DESC {
                SemanticName: windows::core::PCSTR(normal_semantic.as_ptr()),
                SemanticIndex: 0,
                Format: DXGI_FORMAT_R32G32B32_FLOAT,
                InputSlot: 0,
                AlignedByteOffset: 12,
                InputSlotClass: D3D12_INPUT_CLASSIFICATION_PER_VERTEX_DATA,
                InstanceDataStepRate: 0,
            },
        ];

        let input_layout = D3D12_INPUT_LAYOUT_DESC {
            pInputElementDescs: input_elements.as_ptr(),
            NumElements: input_elements.len() as u32,
        };

        println!("✅ Input layout created");

      


        // ==========================================
        // ROOT SIGNATURE
        // ==========================================

       let camera_root_parameter = D3D12_ROOT_PARAMETER {
    ParameterType: D3D12_ROOT_PARAMETER_TYPE_CBV,
    Anonymous: windows::Win32::Graphics::Direct3D12::D3D12_ROOT_PARAMETER_0 {
        Descriptor: windows::Win32::Graphics::Direct3D12::D3D12_ROOT_DESCRIPTOR {
            ShaderRegister: 0,
            RegisterSpace: 0,
        },
    },
    ShaderVisibility: D3D12_SHADER_VISIBILITY_ALL,
};

let root_signature_description =
    D3D12_ROOT_SIGNATURE_DESC {
        NumParameters: 1,
        pParameters: &camera_root_parameter,
        NumStaticSamplers: 0,
        pStaticSamplers: std::ptr::null(),
        Flags:
            D3D12_ROOT_SIGNATURE_FLAG_ALLOW_INPUT_ASSEMBLER_INPUT_LAYOUT,
    };

let mut serialized_root_signature = None;
let mut root_signature_error = None;

D3D12SerializeRootSignature(
    &root_signature_description,
    D3D_ROOT_SIGNATURE_VERSION_1,
    &mut serialized_root_signature,
    Some(&mut root_signature_error),
)
.expect("Failed to serialize root signature");
let serialized_root_signature =
    serialized_root_signature.expect("Root signature was not serialized");

let root_signature =
    device
        .CreateRootSignature::<ID3D12RootSignature>(
            0,
            std::slice::from_raw_parts(
                serialized_root_signature.GetBufferPointer() as *const u8,
                serialized_root_signature.GetBufferSize(),
            ),
        )
        .expect("Failed to create root signature");

println!("✅ Root signature created");
// ==========================================
// 🌑 SHADOW ROOT SIGNATURE
// ==========================================

let shadow_root_parameter = D3D12_ROOT_PARAMETER {
    ParameterType: D3D12_ROOT_PARAMETER_TYPE_CBV,
    Anonymous:
        windows::Win32::Graphics::Direct3D12::D3D12_ROOT_PARAMETER_0 {
            Descriptor:
                windows::Win32::Graphics::Direct3D12::D3D12_ROOT_DESCRIPTOR {
                    ShaderRegister: 0,
                    RegisterSpace: 0,
                },
        },
    ShaderVisibility: D3D12_SHADER_VISIBILITY_ALL,
};

let shadow_root_signature_description =
    D3D12_ROOT_SIGNATURE_DESC {
        NumParameters: 1,
        pParameters: &shadow_root_parameter,
        NumStaticSamplers: 0,
        pStaticSamplers: std::ptr::null(),
        Flags:
            D3D12_ROOT_SIGNATURE_FLAG_ALLOW_INPUT_ASSEMBLER_INPUT_LAYOUT,
    };

let mut shadow_root_signature_blob = None;
let mut shadow_root_signature_error = None;

D3D12SerializeRootSignature(
    &shadow_root_signature_description,
    D3D_ROOT_SIGNATURE_VERSION_1,
    &mut shadow_root_signature_blob,
    Some(&mut shadow_root_signature_error),
)
.expect("Failed to serialize shadow root signature");

let shadow_root_signature_blob =
    shadow_root_signature_blob
        .expect("Shadow root signature blob was not created");

let shadow_root_signature: ID3D12RootSignature =
    device
        .CreateRootSignature(
            0,
            std::slice::from_raw_parts(
                shadow_root_signature_blob.GetBufferPointer()
                    as *const u8,
                shadow_root_signature_blob.GetBufferSize(),
            ),
        )
        .expect("Failed to create shadow root signature");

println!("✅ Shadow root signature created");

        // ==========================================
        // LOAD HLSL SHADERS
        // ==========================================

        let vertex_shader =
            std::fs::read(
                r"C:\Users\farru\OneDrive\Desktop\JungleScript\3d\shaders\realistic_vs.dxil"
            )
            .expect("Failed to load vertex shader");

        let pixel_shader =
            std::fs::read(
                r"C:\Users\farru\OneDrive\Desktop\JungleScript\3d\shaders\realistic_ps.dxil"
            )
            .expect("Failed to load pixel shader");
            let shadow_vertex_shader =
    std::fs::read(
        r"C:\Users\farru\OneDrive\Desktop\JungleScript\3d\shaders\shadow_vs.dxil"
    )
    .expect("Failed to load shadow vertex shader");

println!("✅ Shadow vertex shader loaded");

        println!("✅ HLSL shaders loaded");

        let vertex_shader_bytecode = D3D12_SHADER_BYTECODE {
            pShaderBytecode:
                vertex_shader.as_ptr()
                    as *const std::ffi::c_void,
            BytecodeLength: vertex_shader.len(),
        };

        let pixel_shader_bytecode = D3D12_SHADER_BYTECODE {
            pShaderBytecode:
                pixel_shader.as_ptr()
                    as *const std::ffi::c_void,
            BytecodeLength: pixel_shader.len(),
        };

        println!("✅ Shader bytecodes created");

        // ==========================================
        // PIPELINE STATES
        // ==========================================

        let blend_state = D3D12_BLEND_DESC {
            AlphaToCoverageEnable: false.into(),
            IndependentBlendEnable: false.into(),
            RenderTarget: [
                D3D12_RENDER_TARGET_BLEND_DESC {
                    BlendEnable: false.into(),
                    LogicOpEnable: false.into(),
                    SrcBlend: D3D12_BLEND_ONE,
                    DestBlend: D3D12_BLEND_ZERO,
                    BlendOp: D3D12_BLEND_OP_ADD,
                    SrcBlendAlpha: D3D12_BLEND_ONE,
                    DestBlendAlpha: D3D12_BLEND_ZERO,
                    BlendOpAlpha: D3D12_BLEND_OP_ADD,
                    
                    LogicOp: D3D12_LOGIC_OP_NOOP,
                    RenderTargetWriteMask:
                        D3D12_COLOR_WRITE_ENABLE_ALL.0 as u8,
                },
                D3D12_RENDER_TARGET_BLEND_DESC::default(),
                D3D12_RENDER_TARGET_BLEND_DESC::default(),
                D3D12_RENDER_TARGET_BLEND_DESC::default(),
                D3D12_RENDER_TARGET_BLEND_DESC::default(),
                D3D12_RENDER_TARGET_BLEND_DESC::default(),
                D3D12_RENDER_TARGET_BLEND_DESC::default(),
                D3D12_RENDER_TARGET_BLEND_DESC::default(),
            ],
        };

        let rasterizer_state = D3D12_RASTERIZER_DESC {
            FillMode: D3D12_FILL_MODE_SOLID,
            CullMode: D3D12_CULL_MODE_NONE,
            FrontCounterClockwise: false.into(),
            DepthBias: 0,
            DepthBiasClamp: 0.0,
            SlopeScaledDepthBias: 0.0,
            DepthClipEnable: true.into(),
            MultisampleEnable: false.into(),
            AntialiasedLineEnable: false.into(),
            ForcedSampleCount: 0,
            ConservativeRaster: Default::default(),
        };

        let depth_stencil_state = D3D12_DEPTH_STENCIL_DESC {
    DepthEnable: true.into(),
    DepthWriteMask: windows::Win32::Graphics::Direct3D12::D3D12_DEPTH_WRITE_MASK_ALL,
    DepthFunc: windows::Win32::Graphics::Direct3D12::D3D12_COMPARISON_FUNC_LESS,
    StencilEnable: false.into(),
    StencilReadMask: 0,
    StencilWriteMask: 0,
    FrontFace: Default::default(),
    BackFace: Default::default(),
};

        let pipeline_description =
            windows::Win32::Graphics::Direct3D12::
                D3D12_GRAPHICS_PIPELINE_STATE_DESC {
                    pRootSignature:
                        std::mem::ManuallyDrop::new(
                            Some(root_signature.clone()),
                        ),

                    VS: vertex_shader_bytecode,
                    PS: pixel_shader_bytecode,

                    DS: Default::default(),
                    HS: Default::default(),
                    GS: Default::default(),

                    StreamOutput: Default::default(),

                    BlendState: blend_state,
                    SampleMask: u32::MAX,
                    RasterizerState: rasterizer_state,
                    DepthStencilState: depth_stencil_state,

                    InputLayout: input_layout,

                    IBStripCutValue: Default::default(),

                    PrimitiveTopologyType:
                        D3D12_PRIMITIVE_TOPOLOGY_TYPE_TRIANGLE,

                    NumRenderTargets: 1,

                    RTVFormats: [
                        DXGI_FORMAT_R8G8B8A8_UNORM,
                        DXGI_FORMAT_UNKNOWN,
                        DXGI_FORMAT_UNKNOWN,
                        DXGI_FORMAT_UNKNOWN,
                        DXGI_FORMAT_UNKNOWN,
                        DXGI_FORMAT_UNKNOWN,
                        DXGI_FORMAT_UNKNOWN,
                        DXGI_FORMAT_UNKNOWN,
                    ],

                    DSVFormat: DXGI_FORMAT_D32_FLOAT,

                    SampleDesc: DXGI_SAMPLE_DESC {
                        Count: 1,
                        Quality: 0,
                    },

                    NodeMask: 0,
                    CachedPSO: Default::default(),
                    Flags: Default::default(),
                };

        let graphics_pipeline: ID3D12PipelineState =
            device
                .CreateGraphicsPipelineState(
                    &pipeline_description
                )
                .expect(
                    "Failed to create graphics pipeline",
                );

        println!("✅ Graphics pipeline created");
       
        // ==========================================
// 🌑 SHADOW DEPTH-ONLY PIPELINE
// ==========================================

let shadow_shader_bytecode =
    D3D12_SHADER_BYTECODE {
        pShaderBytecode: shadow_vertex_shader.as_ptr() as *const _,
        BytecodeLength: shadow_vertex_shader.len(),
    };

let shadow_rasterizer_state =
    D3D12_RASTERIZER_DESC {
        FillMode: D3D12_FILL_MODE_SOLID,
        CullMode: D3D12_CULL_MODE_BACK,
        FrontCounterClockwise: false.into(),
        DepthBias: 0,
        DepthBiasClamp: 0.0,
        SlopeScaledDepthBias: 0.0,
        DepthClipEnable: true.into(),
        MultisampleEnable: false.into(),
        AntialiasedLineEnable: false.into(),
        ForcedSampleCount: 0,
        ConservativeRaster: D3D12_CONSERVATIVE_RASTERIZATION_MODE_OFF,
    };

let shadow_depth_stencil_state =
    D3D12_DEPTH_STENCIL_DESC {
        DepthEnable: true.into(),
        DepthWriteMask: D3D12_DEPTH_WRITE_MASK_ALL,
        DepthFunc: D3D12_COMPARISON_FUNC_LESS,
        StencilEnable: false.into(),
        StencilReadMask: 0,
        StencilWriteMask: 0,
        FrontFace: Default::default(),
        BackFace: Default::default(),
    };

let shadow_pipeline_description =
    D3D12_GRAPHICS_PIPELINE_STATE_DESC {
        pRootSignature: std::mem::ManuallyDrop::new(
    Some(shadow_root_signature.clone())
),

        VS: shadow_shader_bytecode,

        PS: D3D12_SHADER_BYTECODE::default(),

        DS: D3D12_SHADER_BYTECODE::default(),
        HS: D3D12_SHADER_BYTECODE::default(),
        GS: D3D12_SHADER_BYTECODE::default(),

        StreamOutput: Default::default(),

        BlendState: D3D12_BLEND_DESC {
            AlphaToCoverageEnable: false.into(),
            IndependentBlendEnable: false.into(),
            RenderTarget: [D3D12_RENDER_TARGET_BLEND_DESC::default(); 8],
        },

        SampleMask: u32::MAX,

        RasterizerState: shadow_rasterizer_state,

        DepthStencilState: shadow_depth_stencil_state,

        InputLayout: input_layout,

        IBStripCutValue:
            D3D12_INDEX_BUFFER_STRIP_CUT_VALUE_DISABLED,

        PrimitiveTopologyType:
            D3D12_PRIMITIVE_TOPOLOGY_TYPE_TRIANGLE,

        NumRenderTargets: 0,

        RTVFormats: [DXGI_FORMAT_UNKNOWN; 8],

        DSVFormat: DXGI_FORMAT_D32_FLOAT,

        SampleDesc: DXGI_SAMPLE_DESC {
            Count: 1,
            Quality: 0,
        },

        NodeMask: 0,
        CachedPSO: Default::default(),
        Flags: D3D12_PIPELINE_STATE_FLAG_NONE,
    };
    

let shadow_pipeline: ID3D12PipelineState =
    device
        .CreateGraphicsPipelineState(
            &shadow_pipeline_description
        )
        .expect("Failed to create shadow pipeline");

println!("✅ Shadow depth-only pipeline created");

        // ==========================================
        // COMMAND QUEUE
        // ==========================================

        let queue_description =
            D3D12_COMMAND_QUEUE_DESC {
                Type: D3D12_COMMAND_LIST_TYPE_DIRECT,
                Priority: 0,
                Flags: Default::default(),
                NodeMask: 0,
            };

        let command_queue: ID3D12CommandQueue =
            device
                .CreateCommandQueue(
                    &queue_description
                )
                .expect(
                    "Failed to create command queue",
                );

        println!("✅ DirectX 12 command queue created");

        // ==========================================
        // DXGI FACTORY
        // ==========================================

        let factory: IDXGIFactory4 =
            CreateDXGIFactory2(
                DXGI_CREATE_FACTORY_FLAGS(0)
            )
            .expect(
                "Failed to create DXGI factory"
            );

        println!("✅ DXGI factory created");

        // ==========================================
        // SWAP CHAIN
        // ==========================================

        let swap_chain_description =
            DXGI_SWAP_CHAIN_DESC1 {
                Width: 1280,
                Height: 720,
                Format:
                    DXGI_FORMAT_R8G8B8A8_UNORM,
                Stereo: false.into(),
                SampleDesc: DXGI_SAMPLE_DESC {
                    Count: 1,
                    Quality: 0,
                },
                BufferUsage:
                    DXGI_USAGE_RENDER_TARGET_OUTPUT,
                BufferCount: 2,
                Scaling: Default::default(),
                SwapEffect:
                    DXGI_SWAP_EFFECT_FLIP_DISCARD,
                AlphaMode: Default::default(),
                Flags: 0,
            };

        let swap_chain =
            factory
                .CreateSwapChainForHwnd(
                    &command_queue,
                    hwnd,
                    &swap_chain_description,
                    None,
                    None,
                )
                .expect(
                    "Failed to create swap chain"
                );

        let swap_chain: IDXGISwapChain3 =
            swap_chain
                .cast()
                .expect(
                    "Failed to cast swap chain"
                );

        println!("✅ DXGI swap chain created");

        // ==========================================
        // RTV DESCRIPTOR HEAP
        // ==========================================

        let rtv_heap_description =
            D3D12_DESCRIPTOR_HEAP_DESC {
                Type: D3D12_DESCRIPTOR_HEAP_TYPE_RTV,
                NumDescriptors: 2,
                Flags: D3D12_DESCRIPTOR_HEAP_FLAG_NONE,
                NodeMask: 0,
            };

       let rtv_heap: ID3D12DescriptorHeap =
    device.CreateDescriptorHeap(
               
                    &rtv_heap_description
                )
                .expect(
                    "Failed to create RTV heap"
                );

        println!("✅ RTV descriptor heap created");

        let rtv_descriptor_size =
            device.GetDescriptorHandleIncrementSize(
                D3D12_DESCRIPTOR_HEAP_TYPE_RTV
            );

        let rtv_start =
            rtv_heap.GetCPUDescriptorHandleForHeapStart();

        // ==========================================
        // SWAP CHAIN BACK BUFFERS
        // ==========================================

        let mut render_targets:
            Vec<ID3D12Resource> = Vec::new();

        for index in 0..2u32 {
            let back_buffer:
                ID3D12Resource =
                swap_chain
                    .GetBuffer(index)
                    .expect(
                        "Failed to get swap chain buffer"
                    );

            let handle =
                D3D12_CPU_DESCRIPTOR_HANDLE {
                    ptr: rtv_start.ptr
                        + index as usize
                            * rtv_descriptor_size as usize,
                };

            device.CreateRenderTargetView(
                &back_buffer,
                None,
                handle,
            );

            render_targets.push(back_buffer);
        }

        println!("✅ Render target views created");
        // ==========================================
// DEPTH BUFFER
// ==========================================

let depth_heap_properties = D3D12_HEAP_PROPERTIES {
    Type: windows::Win32::Graphics::Direct3D12::D3D12_HEAP_TYPE_DEFAULT,
    CPUPageProperty: Default::default(),
    MemoryPoolPreference: Default::default(),
    CreationNodeMask: 1,
    VisibleNodeMask: 1,
};

let depth_description = D3D12_RESOURCE_DESC {
    Dimension: windows::Win32::Graphics::Direct3D12::D3D12_RESOURCE_DIMENSION_TEXTURE2D,
    Alignment: 0,
    Width: 1280,
    Height: 720,
    DepthOrArraySize: 1,
    MipLevels: 1,
    Format: DXGI_FORMAT_D32_FLOAT,
    SampleDesc: DXGI_SAMPLE_DESC {
        Count: 1,
        Quality: 0,
    },
    Layout: windows::Win32::Graphics::Direct3D12::D3D12_TEXTURE_LAYOUT_UNKNOWN,
    Flags: windows::Win32::Graphics::Direct3D12::D3D12_RESOURCE_FLAG_ALLOW_DEPTH_STENCIL,
};

let depth_clear_value =
    windows::Win32::Graphics::Direct3D12::D3D12_CLEAR_VALUE {
        Format: DXGI_FORMAT_D32_FLOAT,
        Anonymous:
            windows::Win32::Graphics::Direct3D12::D3D12_CLEAR_VALUE_0 {
                DepthStencil:
                    windows::Win32::Graphics::Direct3D12::D3D12_DEPTH_STENCIL_VALUE {
                        Depth: 1.0,
                        Stencil: 0,
                    },
            },
    };

let mut depth_buffer: Option<ID3D12Resource> = None;

device
    .CreateCommittedResource(
        &depth_heap_properties,
        windows::Win32::Graphics::Direct3D12::D3D12_HEAP_FLAG_NONE,
        &depth_description,
        windows::Win32::Graphics::Direct3D12::D3D12_RESOURCE_STATE_DEPTH_WRITE,
        Some(&depth_clear_value),
        &mut depth_buffer,
    )
    .expect("Failed to create depth buffer");

let depth_buffer =
    depth_buffer.expect("Depth buffer was not created");

println!("✅ Depth buffer created");
// ==========================================
// SHADOW MAP
// ==========================================

let shadow_map_description = D3D12_RESOURCE_DESC {
    Dimension:
        windows::Win32::Graphics::Direct3D12::D3D12_RESOURCE_DIMENSION_TEXTURE2D,
    Alignment: 0,

    // Shadow maps don't need to be as large as the screen.
    Width: 2048,
    Height: 2048,

    DepthOrArraySize: 1,
    MipLevels: 1,

    // Typeless so we can later create both
    // a DSV and an SRV from the same resource.
    Format: DXGI_FORMAT_R32_TYPELESS,

    SampleDesc: DXGI_SAMPLE_DESC {
        Count: 1,
        Quality: 0,
    },

    Layout:
        windows::Win32::Graphics::Direct3D12::D3D12_TEXTURE_LAYOUT_UNKNOWN,

    Flags:
        windows::Win32::Graphics::Direct3D12::D3D12_RESOURCE_FLAG_ALLOW_DEPTH_STENCIL,
};

let shadow_map_clear_value =
    windows::Win32::Graphics::Direct3D12::D3D12_CLEAR_VALUE {
        Format: DXGI_FORMAT_D32_FLOAT,
        Anonymous:
            windows::Win32::Graphics::Direct3D12::D3D12_CLEAR_VALUE_0 {
                DepthStencil:
                    windows::Win32::Graphics::Direct3D12::D3D12_DEPTH_STENCIL_VALUE {
                        Depth: 1.0,
                        Stencil: 0,
                    },
            },
    };

let mut shadow_map: Option<ID3D12Resource> = None;

device
    .CreateCommittedResource(
        &depth_heap_properties,
        windows::Win32::Graphics::Direct3D12::D3D12_HEAP_FLAG_NONE,
        &shadow_map_description,
        D3D12_RESOURCE_STATE_DEPTH_WRITE,
        Some(&shadow_map_clear_value),
        &mut shadow_map,
    )
    .expect("Failed to create shadow map");

let shadow_map =
    shadow_map.expect("Shadow map was not created");

println!("✅ Shadow map created");
// ==========================================
// 🌑 SHADOW MAP SRV HEAP
// ==========================================

let shadow_srv_heap_description = D3D12_DESCRIPTOR_HEAP_DESC {
    Type: D3D12_DESCRIPTOR_HEAP_TYPE_CBV_SRV_UAV,
    NumDescriptors: 1,
    Flags: D3D12_DESCRIPTOR_HEAP_FLAG_SHADER_VISIBLE,
    NodeMask: 0,
};

let shadow_srv_heap: ID3D12DescriptorHeap =
    device
        .CreateDescriptorHeap(&shadow_srv_heap_description)
        .expect("Failed to create shadow SRV heap");

let shadow_srv_handle =
    shadow_srv_heap.GetCPUDescriptorHandleForHeapStart();

println!("✅ Shadow SRV descriptor heap created");
let shadow_srv_description = D3D12_SHADER_RESOURCE_VIEW_DESC {
    Format: DXGI_FORMAT_R32_FLOAT,
    ViewDimension: D3D12_SRV_DIMENSION_TEXTURE2D,
    Shader4ComponentMapping:
        D3D12_DEFAULT_SHADER_4_COMPONENT_MAPPING,
    Anonymous: D3D12_SHADER_RESOURCE_VIEW_DESC_0 {
        Texture2D: D3D12_TEX2D_SRV {
            MostDetailedMip: 0,
            MipLevels: 1,
            PlaneSlice: 0,
            ResourceMinLODClamp: 0.0,
        },
    },
};

device.CreateShaderResourceView(
    &shadow_map,
    Some(&shadow_srv_description),
    shadow_srv_handle,
);

println!("✅ Shadow-map SRV created");
// ==========================================
// SHADOW MAP DEPTH-STENCIL VIEW
// ==========================================

let shadow_dsv_heap_description =
    D3D12_DESCRIPTOR_HEAP_DESC {
        Type:
            windows::Win32::Graphics::Direct3D12::
                D3D12_DESCRIPTOR_HEAP_TYPE_DSV,

        NumDescriptors: 1,

        Flags:
            D3D12_DESCRIPTOR_HEAP_FLAG_NONE,

        NodeMask: 0,
    };

let shadow_dsv_heap: ID3D12DescriptorHeap =
    device
        .CreateDescriptorHeap(
            &shadow_dsv_heap_description
        )
        .expect("Failed to create shadow DSV heap");

let shadow_dsv_handle =
    shadow_dsv_heap.GetCPUDescriptorHandleForHeapStart();

let shadow_depth_view =
    D3D12_DEPTH_STENCIL_VIEW_DESC {
        Format: DXGI_FORMAT_D32_FLOAT,

        ViewDimension:
            D3D12_DSV_DIMENSION_TEXTURE2D,

        Flags: Default::default(),

        Anonymous:
            windows::Win32::Graphics::Direct3D12::
                D3D12_DEPTH_STENCIL_VIEW_DESC_0 {
                    Texture2D:
                        windows::Win32::Graphics::Direct3D12::
                            D3D12_TEX2D_DSV {
                                MipSlice: 0,
                            },
                },
    };

device.CreateDepthStencilView(
    &shadow_map,
    Some(&shadow_depth_view),
    shadow_dsv_handle,
);

println!("✅ Shadow-map depth-stencil view created");
let dsv_heap_description =
    D3D12_DESCRIPTOR_HEAP_DESC {
        Type: windows::Win32::Graphics::Direct3D12::D3D12_DESCRIPTOR_HEAP_TYPE_DSV,
        NumDescriptors: 1,
        Flags: D3D12_DESCRIPTOR_HEAP_FLAG_NONE,
        NodeMask: 0,
    };

let dsv_heap: ID3D12DescriptorHeap =
    device
        .CreateDescriptorHeap(&dsv_heap_description)
        .expect("Failed to create DSV heap");

let dsv_handle =
    dsv_heap.GetCPUDescriptorHandleForHeapStart();

let depth_view = D3D12_DEPTH_STENCIL_VIEW_DESC {
    Format: DXGI_FORMAT_D32_FLOAT,
    ViewDimension: D3D12_DSV_DIMENSION_TEXTURE2D,
    Flags: Default::default(),
    Anonymous:
        windows::Win32::Graphics::Direct3D12::D3D12_DEPTH_STENCIL_VIEW_DESC_0 {
            Texture2D:
                windows::Win32::Graphics::Direct3D12::D3D12_TEX2D_DSV {
                    MipSlice: 0,
                },
        },
};

device.CreateDepthStencilView(
    &depth_buffer,
    Some(&depth_view),
    dsv_handle,
);

println!("✅ Depth-stencil view created");

        // ==========================================
        // COMMAND ALLOCATOR
        // ==========================================

        let command_allocator:
            ID3D12CommandAllocator =
            device
                .CreateCommandAllocator(
                    D3D12_COMMAND_LIST_TYPE_DIRECT
                )
                .expect(
                    "Failed to create command allocator"
                );

        println!(
            "✅ DirectX 12 command allocator created"
        );

        // ==========================================
        // COMMAND LIST
        // ==========================================

        let command_list:
            ID3D12GraphicsCommandList =
            device
                .CreateCommandList(
                    0,
                    D3D12_COMMAND_LIST_TYPE_DIRECT,
                    &command_allocator,
                    Some(&graphics_pipeline),
                )
                .expect(
                    "Failed to create command list"
                );

        // ==========================================
        // FENCE
        // ==========================================

        let fence: ID3D12Fence =
            device
                .CreateFence(
                    0,
                    D3D12_FENCE_FLAG_NONE
                )
                .expect(
                    "Failed to create fence"
                );

        let fence_event =
            CreateEventW(
                None,
                false,
                false,
                None,
            )
            .expect(
                "Failed to create fence event"
            );

        // ==========================================
        // RENDER FIRST FRAME
        // ==========================================

        let frame_index =
            swap_chain.GetCurrentBackBufferIndex();

        let current_buffer =
            render_targets[
                frame_index as usize
            ].clone();

        let barrier_to_render =
            D3D12_RESOURCE_BARRIER {
                Type:
                    windows::Win32::Graphics::Direct3D12::
                        D3D12_RESOURCE_BARRIER_TYPE_TRANSITION,
                Flags: Default::default(),
                Anonymous:
                    D3D12_RESOURCE_BARRIER_0 {
                        Transition:
                            std::mem::ManuallyDrop::new(
                                D3D12_RESOURCE_TRANSITION_BARRIER {
                                   pResource: std::mem::ManuallyDrop::new(
    Some(current_buffer.clone())
),
                                    Subresource:
                                        windows::Win32::Graphics::Direct3D12::
                                            D3D12_RESOURCE_BARRIER_ALL_SUBRESOURCES,
                                    StateBefore:
                                        D3D12_RESOURCE_STATE_PRESENT,
                                    StateAfter:
                                        D3D12_RESOURCE_STATE_RENDER_TARGET,
                                }
                            ),
                    },
            };

        command_list.ResourceBarrier(
            &[barrier_to_render]
        );
        // ==========================================
// 🌑 SHADOW MAP PASS
// ==========================================

command_list.SetPipelineState(&shadow_pipeline);
command_list.SetGraphicsRootSignature(&shadow_root_signature);

// Bind the shadow-map depth buffer
unsafe {
    command_list.OMSetRenderTargets(
        0,
        None,
        false,
        Some(&shadow_dsv_handle),
    );
}

// Clear the shadow map
command_list.ClearDepthStencilView(
    shadow_dsv_handle,
    D3D12_CLEAR_FLAG_DEPTH,
    1.0,
    0,
    Some(&[]),
);

// Shadow-map viewport
let shadow_viewport = D3D12_VIEWPORT {
    TopLeftX: 0.0,
    TopLeftY: 0.0,
    Width: 2048.0,
    Height: 2048.0,
    MinDepth: 0.0,
    MaxDepth: 1.0,
};

command_list.RSSetViewports(&[shadow_viewport]);

// Shadow-map scissor
let shadow_scissor = RECT {
    left: 0,
    top: 0,
    right: 2048,
    bottom: 2048,
};

command_list.RSSetScissorRects(&[shadow_scissor]);

// Use the light's camera matrix
command_list.SetGraphicsRootConstantBufferView(
    0,
    light_buffer.GetGPUVirtualAddress(),
);

// Same cube geometry
command_list.IASetPrimitiveTopology(
    windows::Win32::Graphics::Direct3D::D3D_PRIMITIVE_TOPOLOGY_TRIANGLELIST
);

command_list.IASetVertexBuffers(
    0,
    Some(&[vertex_buffer_view]),
);

command_list.DrawInstanced(36, 1, 0, 0);

println!("✅ Shadow-map draw command recorded");
// ==========================================
// 🌑 SHADOW MAP → SHADER RESOURCE
// ==========================================

let shadow_map_to_shader = D3D12_RESOURCE_BARRIER {
    Type: D3D12_RESOURCE_BARRIER_TYPE_TRANSITION,
    Flags: Default::default(),
    Anonymous: D3D12_RESOURCE_BARRIER_0 {
        Transition: std::mem::ManuallyDrop::new(
            D3D12_RESOURCE_TRANSITION_BARRIER {
                pResource: std::mem::ManuallyDrop::new(
                    Some(shadow_map.clone())
                ),
                Subresource:
                    D3D12_RESOURCE_BARRIER_ALL_SUBRESOURCES,
                StateBefore:
                    D3D12_RESOURCE_STATE_DEPTH_WRITE,
                StateAfter:
                    D3D12_RESOURCE_STATE_PIXEL_SHADER_RESOURCE,
            }
        ),
    },
};

command_list.ResourceBarrier(&[shadow_map_to_shader]);

println!("✅ Shadow map transitioned to shader resource");

        // ==========================================
        // CLEAR
        // ==========================================
        let rtv_handle =
    D3D12_CPU_DESCRIPTOR_HANDLE {
        ptr: rtv_start.ptr
            + frame_index as usize
                * rtv_descriptor_size as usize,
    };

// Bind the back buffer as the render target
unsafe {
   command_list.OMSetRenderTargets(
    1,
    Some(&rtv_handle as *const D3D12_CPU_DESCRIPTOR_HANDLE),
    false,
    Some(&dsv_handle),
);
}

command_list.ClearRenderTargetView(
    rtv_handle,
    &[0.02, 0.08, 0.02, 1.0],
    Some(&[]),
);
command_list.ClearDepthStencilView(
    dsv_handle,
    windows::Win32::Graphics::Direct3D12::D3D12_CLEAR_FLAG_DEPTH,
    1.0,
    0,
    Some(&[]),
);


        // ==========================================
        // VIEWPORT
        // ==========================================

        let viewport = D3D12_VIEWPORT {
            TopLeftX: 0.0,
            TopLeftY: 0.0,
            Width: 1280.0,
            Height: 720.0,
            MinDepth: 0.0,
            MaxDepth: 1.0,
        };

        command_list.RSSetViewports(
            &[viewport]
        );

        let scissor_rect = RECT {
            left: 0,
            top: 0,
            right: 1280,
            bottom: 720,
        };

        command_list.RSSetScissorRects(
            &[scissor_rect]
        );

        // ==========================================
        // DRAW TRIANGLE
        // ==========================================

        command_list.SetPipelineState(
            &graphics_pipeline
        );

        command_list.SetGraphicsRootSignature(
            &root_signature
        );
        command_list.SetGraphicsRootConstantBufferView(
    0,
    camera_buffer.GetGPUVirtualAddress(),
);

       command_list.IASetPrimitiveTopology(
    windows::Win32::Graphics::Direct3D::D3D_PRIMITIVE_TOPOLOGY_TRIANGLELIST
);

        command_list.IASetVertexBuffers(
            0,
            Some(&[vertex_buffer_view])
        );

        command_list.DrawInstanced(
            36,
            1,
            0,
            0
        );

        println!("✅ Cube draw command recorded");

        // ==========================================
        // PRESENT BARRIER
        // ==========================================

        let barrier_to_present =
            D3D12_RESOURCE_BARRIER {
                Type:
                    windows::Win32::Graphics::Direct3D12::
                        D3D12_RESOURCE_BARRIER_TYPE_TRANSITION,
                Flags: Default::default(),
                Anonymous:
                    D3D12_RESOURCE_BARRIER_0 {
                        Transition:
                            std::mem::ManuallyDrop::new(
                                D3D12_RESOURCE_TRANSITION_BARRIER {
                                   pResource: std::mem::ManuallyDrop::new(
    Some(current_buffer.clone())
),
                                    Subresource:
                                        windows::Win32::Graphics::Direct3D12::
                                            D3D12_RESOURCE_BARRIER_ALL_SUBRESOURCES,
                                    StateBefore:
                                        D3D12_RESOURCE_STATE_RENDER_TARGET,
                                    StateAfter:
                                        D3D12_RESOURCE_STATE_PRESENT,
                                }
                            ),
                    },
            };

        command_list.ResourceBarrier(
            &[barrier_to_present]
        );

        command_list.Close()
            .expect(
                "Failed to close command list"
            );

        // ==========================================
        // SUBMIT
        // ==========================================
let command_list_base: windows::Win32::Graphics::Direct3D12::ID3D12CommandList =
    command_list.cast()
        .expect("Failed to cast graphics command list");

let command_lists = [Some(command_list_base)];

command_queue.ExecuteCommandLists(&command_lists);

        println!(
            "✅ Render commands submitted to GPU"
        );

        // ==========================================
        // GPU FENCE
        // ==========================================

        command_queue
            .Signal(&fence, 1)
            .expect(
                "Failed to signal GPU fence"
            );

        println!("✅ GPU fence signaled");

        if fence.GetCompletedValue() < 1 {
            fence.SetEventOnCompletion(
                1,
                fence_event,
            )
            .expect(
                "Failed to set fence event"
            );

            WaitForSingleObject(
                fence_event,
                INFINITE,
            );
        }

        println!("✅ GPU finished rendering");

        // ==========================================
        // PRESENT
        // ==========================================

        swap_chain
            .Present(1, DXGI_PRESENT(0))
            .ok()
            .expect(
                "Failed to present frame"
            );

        println!("✅ First DirectX 12 frame presented!");

        println!("==========================================");
        println!("🌴 JungleGame Native Renderer");
        println!("==========================================");

        // Keep GPU objects alive.
        let _device = device;
        let _vertex_buffer = vertex_buffer;
        let _rtv_heap = rtv_heap;
        let _command_queue = command_queue;
        let _swap_chain = swap_chain;
        let _fence = fence;
        let _fence_event = fence_event;
        let _depth_buffer = depth_buffer;
let _dsv_heap = dsv_heap;

        // ==========================================
        // WINDOWS MESSAGE LOOP
        // ==========================================

        let mut message = MSG::default();

        while GetMessageW(
            &mut message,
            None,
            0,
            0,
        )
        .into()
        {
            let _ = TranslateMessage(&message);
            DispatchMessageW(&message);
        }
    }
}

extern "system" fn window_proc(
    hwnd: HWND,
    msg: u32,
    wparam: WPARAM,
    lparam: LPARAM,
) -> LRESULT {
    unsafe {
        match msg {
            WM_DESTROY => {
                PostQuitMessage(0);
                LRESULT(0)
            }

            _ => DefWindowProcW(
                hwnd,
                msg,
                wparam,
                lparam,
            ),
        }
    }
}